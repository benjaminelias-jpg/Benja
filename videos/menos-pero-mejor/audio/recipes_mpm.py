"""Recipes for 'Menos, pero mejor': soft, rounded, musical. Used by mix.py via --recipes.

Every sound is built from sines, noise, filters and envelopes (procedural-sfx method):
attack = what touches, body = pitch and weight, tail = space.
"""
from sfxkit import *


def _fade_in(x, ms=2.0):
    k = min(n_(ms / 1000), len(x))
    if k:
        x[:k] *= np.linspace(0, 1, k)
    return x


def _bar(f, d, taus, ratios=(1.0, 3.93, 10.6), amps=(1.0, .32, .08)):
    """Struck tuned bar (marimba-like modes 1 : 4 : 10.6), highs decay first."""
    tt = t_(d)
    return sum(a * np.sin(2 * np.pi * f * r * tt + rand() * .3) * env_exp(d, tau)
               for r, a, tau in zip(ratios, amps, taus))


def soft_tap(v=1.0, f=1568.0):
    """Small, delicate 'tink' of a felt mallet on a tiny bar: muted contact + bar modes, short tail."""
    d = .4
    contact = bp(noise(d), 2500, 7000) * env_exp(d, .001) * .15
    body = _bar(f, d, taus=(.075, .02, .006))
    return norm(_fade_in(contact + body)) * v


def tock(v=1.0, f=523.25, weight=.5):
    """Rounded full-stop 'tock': soft wood contact, tuned bar body, a little low warmth, short room."""
    d = 1.1
    tt = t_(d)
    contact = bp(noise(d), 900, 3500) * env_exp(d, .0018) * .22
    body = _bar(f, d, taus=(.22, .05, .012))
    warmth = np.sin(2 * np.pi * (f / 4) * tt * (1 - .04 * tt)) * env_ad(d, .004, .07) * weight
    x = contact + body + warmth
    x = echo(x, delay=.031, feedback=.22, taps=3, damp=2200)
    return norm(_fade_in(x)) * v


def air(v=1.0, d=.75, f0=500.0, f1=2600.0, skew=.5):
    """Airy swish: band-passed noise whose centre glides f0 -> f1 (rising or falling), smooth swell.

    skew = where the swell peaks (0..1 of the length), so the loudest moment can sit on the fastest frame."""
    n = noise(d)
    tt = t_(d)
    out = np.zeros_like(n)
    N = len(n)
    for i in range(0, N, 480):                       # 10 ms blocks, each with 2000 samples of filter run-in
        j = min(i + 480, N)
        f = f0 * (f1 / f0) ** (i / N)                # exponential glide
        out[i:j] = bp(n[max(0, i - 2000):j], f * .75, f * 1.35)[-(j - i):]
    ph = tt / d
    env = np.where(ph < skew, np.sin(np.pi / 2 * ph / skew), np.cos(np.pi / 2 * (ph - skew) / (1 - skew))) ** 2
    return norm(lp(out * env, 6000)) * v
