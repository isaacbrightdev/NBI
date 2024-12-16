#!/usr/bin/ENV bash

.PHONY: dev-shell

dev-shell:
	@if ! command -v nix >/dev/null 2>&1; then \
		echo "Nix is not installed. Installing now..."; \
		curl -L https://nixos.org/nix/install | sh; \
		. $$HOME/.nix-profile/etc/profile.d/nix.sh; \
		fi
	nix-shell

run-servers:
	@npm run dev > /dev/null 2>&1 & 
