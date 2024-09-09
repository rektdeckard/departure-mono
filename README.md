<h1 align="center">
  <br>
  <a href="http://departuremono.com">
    <img src="https://github.com/rektdeckard/departure-mono/blob/main/public/assets/departure-og.png?raw=true" alt="Departure Mono" width="630">
  </a>
  <br>
    Departure Mono
  <br>
</h1>

<h4 align="center">A MONOSPACED PIXEL FONT WITH A LO-FI TECHNICAL VIBE</h4>

## About

Departure Mono is a monospaced pixel font inspired by the constraints of early command-line and graphical user interfaces, the tiny pixel fonts of the late 90s/early 00s, and sci-fi concepts from film and television.

## Installation

### Nix

If you're using the [Nix](https://nixos.org) package manager or NixOS, you can install font using it's canonical name: [`departure-mono`](https://search.nixos.org/packages?channel=unstable&show=departure-mono&from=0&size=50&sort=relevance&type=packages&query=departure-mono):

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

### macOS

Departure Mono can be installed and upgraded with the **Homebrew** package manager:

```sh
brew install font-departure-mono
```

### Manual

Download the latest release from the [releases](https://github.com/rektdeckard/departure-mono/releases/latest) page.

## Usage

For pixel-perfect results, set the font size to increments of 11px.

Experiment with tighter tracking (letter-spacing) for a more comfortable read in some cases — or wider tracking for a sci-fi effect.

## Licenses

| Resource | License | Author   |
| -------- | ------- | -------- |
| Font     | [SIL OFL](https://github.com/rektdeckard/departure-mono/blob/main/public/assets/LICENSE?raw=true) | [Helena Zhang](https://helenazhang.com) |
| Site     | [MIT](https://github.com/rektdeckard/departure-mono/blob/main/LICENSE?raw=true)     | [Helena Zhang](https://helenazhang.com), [Tobias Fried](https://tobiasfried.com) |

