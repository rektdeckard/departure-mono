<h1 align="center">
  <br>
  <a href="http://departuremono.com">
    <img src="https://github.com/rektdeckard/departure-mono/blob/main/public/assets/departure-og.png?raw=true" alt="Departure Mono" width="630">
  </a>
  <br>
  <br>
    Departure Mono
  <br>
</h1>

<h4 align="center">A monospaced pixel font with a lo-fi technical vibe</h4>

## About

Departure Mono is a monospaced pixel font inspired by the constraints of early command-line and graphical user interfaces, the tiny pixel fonts of the late 90s/early 00s, and sci-fi concepts from film and television.

## Installation

If you're making a web thing, you can use the following HTML and CSS :

```
<!-- HTML in your document's head -->
<link rel="preconnect" href="https://departuremono.com">
<link rel="stylesheet" href="https://departuremono.com/mono.css">
```

```
<!-- Import in CSS -->
@import url("https://departuremono.com/mono.css");

:root {
  font-family: Departure Mono, monospace;
}
```

### Homebrew

For macOS users, the [Homebrew](https://brew.sh) package manager can be used to install and upgrade the font using the [`font-departure-mono`](https://formulae.brew.sh/cask/font-departure-mono#default) formula:

```sh
brew install font-departure-mono
```

### Nix

If you're using the [Nix](https://nixos.org) package manager or NixOS, you can install font using its canonical name: [`departure-mono`](https://search.nixos.org/packages?channel=unstable&show=departure-mono&from=0&size=50&sort=relevance&type=packages&query=departure-mono):

```sh
# Here's an example on how to install it using `nix profile`
nix profile install github:NixOS/nixpkgs#departure-mono
# Here's an example on how to install it using `nix-env`
nix-env -iA nixos.departure-mono
```

### NixOS

For [NixOS](https://nixos.org) users, you can add the font to your system configuration by including it in `fonts.packages`:

```nix
{
  fonts.packages = [
    pkgs.departure-mono
  ];
}
```

### Manual

Download the latest release from the [releases](https://github.com/rektdeckard/departure-mono/releases/latest) page.

## Usage

For pixel-perfect results, set the font size to increments of 11px.

Experiment with tighter or wider tracking (letter-spacing).

## Licenses

| Resource | License | Author   |
| -------- | ------- | -------- |
| Font     | [SIL OFL](https://github.com/rektdeckard/departure-mono/blob/main/public/assets/LICENSE?raw=true) | [Helena Zhang](https://helenazhang.com) |
| Site     | [MIT](https://github.com/rektdeckard/departure-mono/blob/main/LICENSE?raw=true)     | [Helena Zhang](https://helenazhang.com), [Tobias Fried](https://tobiasfried.com) |

