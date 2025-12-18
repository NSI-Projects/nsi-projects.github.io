# from browser import document, window, DOMElement
# from browser.html import *
# from browser.timer import set_timeout, clear_timeout

import random
from typing import List, Tuple, Union, Sequence

resize_timer = None

def setup(size: int) -> Tuple[List[List[List[int]]], List[List[List[int]]]]:
    possibilities = [[[i*10 for i in range(1, size+1)] for _ in range(size)] for _ in range(size)]
    colonnes = [[possibilities[i][j] for i in range(size)] for j in range(size)]
    
    return possibilities, colonnes

def find_valid_attempts(nb: int, l: int, possibilities: List[List[Union[List[int], int]]]) -> List[int]:  
    valid_attempts: List[int] = []
    for n, i in enumerate(possibilities[l]): 
        if type(i) == list and nb in i: 
            valid_attempts.append(n) 
    if valid_attempts == []:
        raise Exception(f"No valid attempts at choice({nb}), line {l+1} with actual possibilities : {possibilities}")
    return valid_attempts

def test_lines(attempts: List[List[int]], choice: int, possibilities: List[List[Union[List[int], int]]], size: int) -> bool:
    problem = False
    attempts_copy = [line.copy() for line in attempts]

    for line_index, line in enumerate(attempts):
        if len(line) == 1 and len(attempts) > 1:
            for line_index_to_remove, line_to_remove in enumerate(attempts):
                if line_index_to_remove != line_index and line[0] in line_to_remove:
                    line_to_remove.remove(line[0])
        if len(line) == 0:
            problem = True
            break

    if attempts_copy != attempts:
        problem = test_lines(attempts, choice, possibilities, size)

    return problem

def find_problem(nb: int, l: int, my_choice: int, possibilities: List[List[Union[List[int], int]]]) -> bool:  
    all_attempts = [[e for e in find_valid_attempts(nb, line, possibilities) if e != my_choice] for line in range(l+1, len(possibilities))]

    problem = test_lines(all_attempts, my_choice, possibilities, len(possibilities))
        
    return problem

def tri(nb: int, possibilities: List[List[Union[List[int], int]]], colonnes: List[List[Union[List[int], int]]]) -> None:  
    for i in range(len(possibilities)):
        if nb in possibilities[i]:
            for j in range(len(possibilities[i])):
                if isinstance(possibilities[i][j], list) and nb in possibilities[i][j]:
                    possibilities[i][j].remove(nb) 
        if nb in colonnes[i]:
            for j in range(len(colonnes[i])):
                if isinstance(colonnes[i][j], list) and nb in colonnes[i][j]:
                    possibilities[j][i].remove(nb) 

def choice(nb: int, l: int, possibilities: List[List[Union[List[int], int]]], colonnes: List[List[Union[List[int], int]]]) -> None:  
    valid_attempts = find_valid_attempts(nb, l, possibilities) 
    my_choice = random.choice(valid_attempts) 
        
    problem = find_problem(nb, l, my_choice, possibilities) 

    while problem == True:
        valid_attempts.remove(my_choice)
        my_choice = random.choice(valid_attempts)
        problem = find_problem(nb, l, my_choice, possibilities) 

    possibilities[l][my_choice] = nb
    colonnes[my_choice][l] = nb
    tri(nb, possibilities, colonnes) 
    
def maximum(l: List[int]) -> Tuple[int, int]:
    max_e = (l[0], 0)
    for i in range(len(l)):
        if l[i] > max_e[0]:
            max_e = (l[i], i)
    return max_e    

def count(line: Sequence[int]) -> int:
    copy = list(line)
    nb = 0
    while len(copy) > 0:
        copy = copy[:maximum(copy)[1]]
        nb += 1
    return nb

def draw_svg(svg: DOMElement, cell_width: float, cell_height: float, i: int, j: int, value: str) -> None:
    rect = f'<rect x="{(j)*cell_width}" y="{(i)*cell_height}" width="{cell_width}" height="{cell_height}" fill="#2c2c2c" stroke="#fff"/>'
    svg.html += rect
 
    text_x: float = (j)*cell_width + cell_width/2
    text_y: float = (i)*cell_height + cell_height/2
    txt = f'<text x="{text_x}" y="{text_y}" fill="white" font-family="monospace" font-size="{min(cell_width, cell_height)/2}" text-anchor="middle" dominant-baseline="middle">{value}</text>'
    svg.html += txt

def on_resize(ev: DOMEvent, possibilities: List[List[Union[List[int], int]]], nbs: List[List[int]], size: int):
    global resize_timer
    if resize_timer:
        clear_timeout(resize_timer)
    resize_timer = set_timeout(lambda: print_list(possibilities, nbs, size), 150)

def print_list(possibilities: List[List[Union[List[int], int]]], nbs: List[List[int]], size: int) -> None:
    document["checkbox"].unbind("change")
    document["checkbox"].bind("change", lambda e: print_list(possibilities, nbs, size))

    show = document["checkbox"].checked

    svg: DOMElement = document["gridSVG"]
    svg.html = ""

    cell_width: float = svg.width / (size+2)
    cell_height: float = svg.height / (size+2)

    for i in range(size):
        for j in range(size):
            if i == 0:
                draw_svg(svg, cell_width, cell_height, i, j+1, str(nbs[2][j]))
            if i == size-1:
                draw_svg(svg, cell_width, cell_height, i+2, j+1, str(nbs[3][j]))

            if j == 0:
                draw_svg(svg, cell_width, cell_height, i+1, j, str(nbs[0][i]))
            if j == size-1:
                draw_svg(svg, cell_width, cell_height, i+1, j+2, str(nbs[1][i]))
            value: str = str(possibilities[i][j]) if show else ""
            
            draw_svg(svg, cell_width, cell_height, i+1, j+1, value)

def create_grille(size: int) -> Tuple[List[List[Union[List[int], int]]], List[List[int]]]:
    s: Tuple[List[List[List[int]]], List[List[List[int]]]] = setup(size)
    possibilities: List[List[Union[List[int], int]]] = list(list(x) for x in s[0])
    colonnes: List[List[Union[List[int], int]]] = list(list(x) for x in s[1])

    for i in range(size*10, 0, -10):
        for j in possibilities:
            choice(i, possibilities.index(j), possibilities, colonnes)
    
    counts: List[List[int]] = [[] for _ in range(4)]
    for i in possibilities:
        counts[0].append(count(i))
        counts[1].append(count(i[::-1]))

    for i in colonnes:
        counts[2].append(count(i))
        counts[3].append(count(i[::-1]))

    window.bind("resize", lambda e: on_resize(e, possibilities, counts, size))
        
    return possibilities, counts

def launch_creation(ev: DOMEvent) -> None:
    size: int = int(document["size"].value)
    if size < 1 or size > 10:
        return

    generated = False
    while not generated:
        try:
            grille, nbs = create_grille(size)
            document["checkbox"].checked = False
            print_list(grille, nbs, size)
            generated = True
        except:
            pass

run_btn = document["generate"]
run_btn.bind("click", launch_creation)