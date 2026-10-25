# context-band

Un mod per Claude Code che mostra, in una riga sopra il prompt, quanto spazio resta nella conversazione: la percentuale di contesto usata, i token usati sul totale della finestra e una barra che è verde fino al 50%, diventa gialla sopra il 50% e rossa sopra l'80%. Si aggiorna da solo dopo ogni turno e compare dopo la prima risposta del modello.

```
Contesto ████████░░░░░░░░░░░░ 42% · 84k / 200k token
```

Funziona in Claude Code (terminale, app desktop, VS Code), non nella chat di claude.ai.

## Installazione

Al prompt di una sessione di Claude Code nel terminale:

```
/plugin install context-band --marketplace emacolo84/context-band
```

Rispondi `y` per aggiungere il marketplace, poi scegli lo scope (user è il primo).

Da una shell:

```
claude plugin install context-band --marketplace emacolo84/context-band
```

Nell'app desktop, dove `/plugin` non funziona: clicca + accanto al box del prompt, poi Plugins, Add marketplace con `emacolo84/context-band`, poi Add plugin.
