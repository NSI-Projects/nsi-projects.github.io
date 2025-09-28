import tkinter as tk
from tkinter import messagebox

def monnayeur():
    try:
        a = round(float(entry.get()), 2)
        if a < 0:
            messagebox.showerror("Erreur", "Veuillez entrer un montant supérieur ou égal à 0 !")
            return
    except:
        messagebox.showerror("Erreur", "Veuillez entrer un montant valide !")
        return

    message = f"Voici votre monnaie de {a}€ : \n"
    result = []
    monnaies = [50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1]
    monnaies_types = [
        " billet(s) de 500€", " billet(s) de 200€", " billet(s) de 100€",
        " billet(s) de 50€", " billet(s) de 20€", " billet(s) de 10€",
        " billet(s) de 5€", " pièce(s) de 2€", " pièce(s) de 1€",
        " pièce(s) de 50 centimes", " pièce(s) de 20 centimes",
        " pièce(s) de 10 centimes", " pièce(s) de 5 centimes",
        " pièce(s) de 2 centimes", " pièce(s) de 1 centime"
    ]

    a *= 100
    while a > 0:
        for m in monnaies:
            result.append(a // m)
            a %= m

    if result:
        for i, mt in enumerate(monnaies_types):
            if result[i] != 0:
                message += f"{int(result[i])}{mt}\n"
    else:
        message += f"Il n'y a rien à monnayer !"

    messagebox.showinfo("Résultat", message)

root = tk.Tk()
root.title("Monnayeur")
root.geometry("350x150")
root.resizable(False, False)

tk.Label(root, text="Entrez un montant en € :").grid(row=0, column=0, padx=10, pady=10, sticky="e")

entry = tk.Entry(root)
entry.grid(row=0, column=1, padx=10, pady=10)

tk.Button(root, text="Monnayer", command=monnayeur).grid(row=1, column=0, columnspan=2, pady=10)

tk.Button(root, text="Quitter", command=root.quit).grid(row=2, column=0, columnspan=2, pady=10)

root.mainloop()
