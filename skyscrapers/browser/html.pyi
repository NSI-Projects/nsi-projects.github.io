# browser/html.pyi
from typing import Any, Callable, Union

# ---------- Type pour les enfants ----------
ChildType = Union[str, "HTMLElement"]

# ---------- Événement ----------
class DOMEvent:
    target: Any
    type: str

# ---------- Base de tous les éléments ----------
class HTMLElement:
    id: str
    class_name: str
    style: dict[str, Any]
    text: str
    attrs: dict[str, Any]

    def bind(self, event: str, callback: Callable[[DOMEvent], None]) -> None: ...
    def unbind(self, event: str) -> None: ...
    def append(self, child: "HTMLElement") -> None: ...
    def remove(self) -> None: ...
    def __le__(self, other: "HTMLElement") -> None: ...  # support document <= element
    def __getitem__(self, key: str) -> "HTMLElement": ...
    def __setitem__(self, key: str, value: Any) -> None: ...

# ---------- Éléments de base ----------
class DIV(HTMLElement):
    def __init__(self, *children: ChildType, **attrs: Any) -> None: ...

class SPAN(HTMLElement):
    def __init__(self, *children: ChildType, **attrs: Any) -> None: ...

class BUTTON(HTMLElement):
    def __init__(self, *children: ChildType, **attrs: Any) -> None: ...

class INPUT(HTMLElement):
    def __init__(self, *children: ChildType, **attrs: Any) -> None: ...
    value: str
    checked: bool

class TEXTAREA(HTMLElement):
    def __init__(self, *children: ChildType, **attrs: Any) -> None: ...
    value: str

class SELECT(HTMLElement):
    def __init__(self, *children: ChildType, **attrs: Any) -> None: ...
    value: str

class OPTION(HTMLElement):
    def __init__(self, *children: ChildType, **attrs: Any) -> None: ...
    selected: bool
    value: str

class LABEL(HTMLElement):
    def __init__(self, *children: ChildType, **attrs: Any) -> None: ...

class UL(HTMLElement):
    def __init__(self, *children: ChildType, **attrs: Any) -> None: ...

class LI(HTMLElement):
    def __init__(self, *children: ChildType, **attrs: Any) -> None: ...

class FORM(HTMLElement):
    def __init__(self, *children: ChildType, **attrs: Any) -> None: ...

class IMG(HTMLElement):
    def __init__(self, *children: ChildType, **attrs: Any) -> None: ...
    src: str
    alt: str

class A(HTMLElement):
    def __init__(self, *children: ChildType, **attrs: Any) -> None: ...
    href: str

class H1(HTMLElement): ...
class H2(HTMLElement): ...
class H3(HTMLElement): ...
class H4(HTMLElement): ...
class H5(HTMLElement): ...
class H6(HTMLElement): ...

class TABLE(HTMLElement): ...
class TR(HTMLElement): ...
class TD(HTMLElement): ...
class TH(HTMLElement): ...

class CANVAS(HTMLElement): ...
class SVG(HTMLElement): ...
class VIDEO(HTMLElement): ...
class AUDIO(HTMLElement): ...
class SOURCE(HTMLElement): ...
class BR(HTMLElement): ...
class HR(HTMLElement): ...

# ---------- Typage pour html ----------
DIV = DIV
SPAN = SPAN
BUTTON = BUTTON
INPUT = INPUT
TEXTAREA = TEXTAREA
SELECT = SELECT
OPTION = OPTION
LABEL = LABEL
UL = UL
LI = LI
FORM = FORM
IMG = IMG
A = A
H1 = H1
H2 = H2
H3 = H3
H4 = H4
H5 = H5
H6 = H6
TABLE = TABLE
TR = TR
TD = TD
TH = TH
CANVAS = CANVAS
SVG = SVG
VIDEO = VIDEO
AUDIO = AUDIO
SOURCE = SOURCE
BR = BR
HR = HR