"""
Vending Machine Finite State Machine (FSM)

An event-driven FSM implementation suitable for embedded/real-time systems.
State and context are strictly separated.

State Transition Table:
+----------+----------------+-------------------+------------------------------+------------------+
| Current  | Event          | Condition         | Action                       | Next State       |
+----------+----------------+-------------------+------------------------------+------------------+
| IDLE     | INSERT_COIN    | -                 | Add to balance               | SELECT           |
| SELECT   | SELECT_ITEM    | out of stock      | Set error message            | ERROR            |
| SELECT   | SELECT_ITEM    | balance >= price  | Set selected item            | DISPENSE         |
| SELECT   | SELECT_ITEM    | balance < price   | Set selected item            | PAYMENT          |
| SELECT   | CANCEL         | -                 | -                            | CHANGE           |
| SELECT   | TIMEOUT        | -                 | -                            | CHANGE           |
| PAYMENT  | INSERT_COIN    | balance >= price  | Add to balance               | DISPENSE         |
| PAYMENT  | INSERT_COIN    | balance < price   | Add to balance               | PAYMENT (stay)   |
| PAYMENT  | CANCEL         | -                 | -                            | CHANGE           |
| PAYMENT  | TIMEOUT        | -                 | -                            | CHANGE           |
| DISPENSE | DISPENSE_DONE  | balance > 0       | Decrement stock, clear item  | CHANGE           |
| DISPENSE | DISPENSE_DONE  | balance == 0      | Decrement stock, clear item  | IDLE             |
| CHANGE   | -              | auto              | Return balance, reset ctx    | IDLE             |
| ERROR    | -              | auto              | Refund, reset ctx            | IDLE             |
+----------+----------------+-------------------+------------------------------+------------------+

Diagram Description (Mermaid-compatible):

    stateDiagram-v2
        [*] --> IDLE
        IDLE --> SELECT : INSERT_COIN / add balance
        SELECT --> ERROR : SELECT_ITEM [out of stock]
        SELECT --> DISPENSE : SELECT_ITEM [balance >= price]
        SELECT --> PAYMENT : SELECT_ITEM [balance < price]
        SELECT --> CHANGE : CANCEL | TIMEOUT
        PAYMENT --> DISPENSE : INSERT_COIN [balance >= price]
        PAYMENT --> PAYMENT : INSERT_COIN [balance < price]
        PAYMENT --> CHANGE : CANCEL | TIMEOUT
        DISPENSE --> CHANGE : DISPENSE_DONE [balance > 0]
        DISPENSE --> IDLE : DISPENSE_DONE [balance == 0]
        CHANGE --> IDLE : auto / return change, reset
        ERROR --> IDLE : auto / refund, reset
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Callable


# ---------------------------------------------------------------------------
# States & Events
# ---------------------------------------------------------------------------

class State(Enum):
    IDLE = auto()
    SELECT = auto()
    PAYMENT = auto()
    DISPENSE = auto()
    CHANGE = auto()
    ERROR = auto()


class EventType(Enum):
    INSERT_COIN = auto()
    SELECT_ITEM = auto()
    CANCEL = auto()
    TIMEOUT = auto()
    DISPENSE_DONE = auto()
    ERROR = auto()


@dataclass(frozen=True)
class Event:
    type: EventType
    amount: int = 0       # cents, used with INSERT_COIN
    item_id: str = ""     # used with SELECT_ITEM


# ---------------------------------------------------------------------------
# Context (mutable machine data, separated from state)
# ---------------------------------------------------------------------------

@dataclass
class Context:
    balance: int = 0                              # cents inserted
    selected_item: str = ""                       # currently selected item id
    item_price: dict[str, int] = field(default_factory=dict)   # item_id -> price in cents
    item_stock: dict[str, int] = field(default_factory=dict)   # item_id -> quantity
    error_message: str = ""
    change_due: int = 0                           # cents to return


# ---------------------------------------------------------------------------
# Side-effect hooks (hardware abstraction for embedded targets)
# ---------------------------------------------------------------------------

@dataclass
class MachineIO:
    """Replaceable I/O callbacks — swap these for real hardware drivers."""
    dispense_item: Callable[[str], None] = lambda item_id: None
    return_change: Callable[[int], None] = lambda amount: None
    display_message: Callable[[str], None] = lambda msg: None
    display_error: Callable[[str], None] = lambda msg: None


# ---------------------------------------------------------------------------
# FSM Engine
# ---------------------------------------------------------------------------

class VendingMachineFSM:
    """Event-driven vending machine with separated state and context."""

    def __init__(self, context: Context, io: MachineIO | None = None):
        self._state = State.IDLE
        self._ctx = context
        self._io = io or MachineIO()
        self._transitions: dict[State, Callable[[Event], State]] = {
            State.IDLE: self._handle_idle,
            State.SELECT: self._handle_select,
            State.PAYMENT: self._handle_payment,
            State.DISPENSE: self._handle_dispense,
            State.CHANGE: self._handle_change,
            State.ERROR: self._handle_error,
        }

    # -- public interface ---------------------------------------------------

    @property
    def state(self) -> State:
        return self._state

    @property
    def context(self) -> Context:
        return self._ctx

    def send(self, event: Event) -> State:
        """Process a single event and return the new state."""
        handler = self._transitions[self._state]
        self._state = handler(event)
        # Auto-transitioning states run immediately
        while self._state in (State.DISPENSE, State.CHANGE, State.ERROR):
            handler = self._transitions[self._state]
            self._state = handler(Event(EventType.DISPENSE_DONE))  # dummy event
        return self._state

    # -- state handlers -----------------------------------------------------

    def _handle_idle(self, event: Event) -> State:
        if event.type == EventType.INSERT_COIN:
            if event.amount <= 0:
                return State.IDLE
            self._ctx.balance += event.amount
            self._io.display_message(f"Balance: {self._ctx.balance}c")
            return State.SELECT
        # Ignore all other events in IDLE
        return State.IDLE

    def _handle_select(self, event: Event) -> State:
        if event.type == EventType.SELECT_ITEM:
            item_id = event.item_id
            # Validate item exists
            if item_id not in self._ctx.item_price:
                self._ctx.error_message = f"Unknown item: {item_id}"
                return State.ERROR
            # Check stock
            if self._ctx.item_stock.get(item_id, 0) <= 0:
                self._ctx.error_message = f"Out of stock: {item_id}"
                return State.ERROR
            self._ctx.selected_item = item_id
            price = self._ctx.item_price[item_id]
            if self._ctx.balance >= price:
                return State.DISPENSE
            self._io.display_message(
                f"Insert {price - self._ctx.balance}c more"
            )
            return State.PAYMENT

        if event.type == EventType.INSERT_COIN:
            if event.amount > 0:
                self._ctx.balance += event.amount
                self._io.display_message(f"Balance: {self._ctx.balance}c")
            return State.SELECT

        if event.type in (EventType.CANCEL, EventType.TIMEOUT):
            return State.CHANGE

        return State.SELECT

    def _handle_payment(self, event: Event) -> State:
        if event.type == EventType.INSERT_COIN:
            if event.amount > 0:
                self._ctx.balance += event.amount
            price = self._ctx.item_price[self._ctx.selected_item]
            if self._ctx.balance >= price:
                return State.DISPENSE
            self._io.display_message(
                f"Insert {price - self._ctx.balance}c more"
            )
            return State.PAYMENT

        if event.type in (EventType.CANCEL, EventType.TIMEOUT):
            return State.CHANGE

        return State.PAYMENT

    def _handle_dispense(self, _event: Event) -> State:
        item_id = self._ctx.selected_item
        price = self._ctx.item_price[item_id]

        # Dispense & update stock
        self._io.dispense_item(item_id)
        self._ctx.item_stock[item_id] -= 1
        self._ctx.balance -= price
        self._ctx.selected_item = ""

        self._io.display_message(f"Dispensing {item_id}")

        if self._ctx.balance > 0:
            return State.CHANGE
        # No change needed — go straight to IDLE
        self._reset_context()
        return State.IDLE

    def _handle_change(self, _event: Event) -> State:
        if self._ctx.balance > 0:
            self._ctx.change_due = self._ctx.balance
            self._io.return_change(self._ctx.balance)
            self._io.display_message(f"Returning {self._ctx.balance}c")
        self._reset_context()
        return State.IDLE

    def _handle_error(self, _event: Event) -> State:
        self._io.display_error(self._ctx.error_message)
        # Refund any balance
        if self._ctx.balance > 0:
            self._io.return_change(self._ctx.balance)
        self._reset_context()
        return State.IDLE

    # -- helpers ------------------------------------------------------------

    def _reset_context(self) -> None:
        self._ctx.balance = 0
        self._ctx.selected_item = ""
        self._ctx.error_message = ""
        self._ctx.change_due = 0


# ---------------------------------------------------------------------------
# Demo / smoke test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    messages: list[str] = []

    io = MachineIO(
        dispense_item=lambda item: messages.append(f"[HW] Dispensing {item}"),
        return_change=lambda amt: messages.append(f"[HW] Returning {amt}c"),
        display_message=lambda msg: messages.append(f"[UI] {msg}"),
        display_error=lambda msg: messages.append(f"[ERR] {msg}"),
    )

    ctx = Context(
        item_price={"A1": 150, "B2": 200, "C3": 75},
        item_stock={"A1": 5, "B2": 0, "C3": 10},
    )

    fsm = VendingMachineFSM(ctx, io)

    def show(label: str) -> None:
        print(f"\n--- {label} ---")
        for m in messages:
            print(f"  {m}")
        messages.clear()
        print(f"  State: {fsm.state.name}  Balance: {ctx.balance}c")

    # Scenario 1: exact payment
    print("=" * 50)
    print("Scenario 1: Buy A1 (150c) with exact change")
    fsm.send(Event(EventType.INSERT_COIN, amount=100))
    show("Insert 100c")
    fsm.send(Event(EventType.SELECT_ITEM, item_id="A1"))
    show("Select A1 (need 50c more)")
    fsm.send(Event(EventType.INSERT_COIN, amount=50))
    show("Insert 50c -> dispense")

    # Scenario 2: overpayment (gets change)
    print("\n" + "=" * 50)
    print("Scenario 2: Buy C3 (75c) with 100c")
    fsm.send(Event(EventType.INSERT_COIN, amount=100))
    show("Insert 100c")
    fsm.send(Event(EventType.SELECT_ITEM, item_id="C3"))
    show("Select C3 -> dispense + 25c change")

    # Scenario 3: out of stock
    print("\n" + "=" * 50)
    print("Scenario 3: Try B2 (out of stock)")
    fsm.send(Event(EventType.INSERT_COIN, amount=200))
    show("Insert 200c")
    fsm.send(Event(EventType.SELECT_ITEM, item_id="B2"))
    show("Select B2 -> error + refund")

    # Scenario 4: cancel
    print("\n" + "=" * 50)
    print("Scenario 4: Insert coins then cancel")
    fsm.send(Event(EventType.INSERT_COIN, amount=50))
    show("Insert 50c")
    fsm.send(Event(EventType.CANCEL))
    show("Cancel -> refund 50c")

    print("\n" + "=" * 50)
    print(f"\nFinal stock: {ctx.item_stock}")
