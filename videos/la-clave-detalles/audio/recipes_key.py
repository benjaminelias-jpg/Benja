"""Recipes for 'La clave está en los detalles'. Used by mix.py via --recipes (whooshes use the built-in `whoosh`).

Every sound is built from noise, sines, filters and envelopes (procedural-sfx method):
attack = what touches, body = pitch and weight, tail = space. No sustained tones: nothing hums.
"""
from sfxkit import *


def clink(v=1.0, pitch=1.0):
    """Small brass key coming to rest on paper: soft paper contact + a short, quiet metal ring."""
    d = .45
    tt = t_(d)
    paper = lp(noise(d), 1400) * env_ad(d, .002, .018) * .9
    metal = sum(a * np.sin(2 * np.pi * f * pitch * tt + rand() * 6) * env_exp(d, tau)
                for f, a, tau in [(2310, .5, .05), (3650, .35, .035), (5480, .22, .022), (7870, .1, .012)])
    tick = hp(noise(d), 4000) * env_exp(d, .0009) * .25
    return norm(paper + metal * .55 + tick) * v
