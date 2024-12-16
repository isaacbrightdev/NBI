let
  pkgs = import <nixpkgs> {};

in
pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs-18_x
    pkgs.ruby_3_1
    pkgs.bundler
    pkgs.git
    pkgs.curl
    pkgs.neovim
    pkgs.vim
    pkgs.which
  ];

  shellHook = ''
    # aliases
    alias ll='ls -alhG'
    alias gl='git log --oneline --graph --decorate'

    FOLDER_USER_CONFIG="user_config"

    if [ ! -d "$FOLDER_USER_CONFIG" ]; then
      echo "Creating folder $FOLDER_USER_CONFIG"
      mkdir "$FOLDER_USER_CONFIG"
    else
      echo "Folder $FOLDER_USER_CONFIG already exists"
    fi

    # Create a symlink for the neovim config if it exists
    if [ -d"$HOME/.config/nvim" ]; then
      echo "Using existing nvim config folder"
      ln -sf "$HOME/.config/nvim" $FOLDER_USER_CONFIG/nvim
    else
      echo "No config/nvim settings"
    fi

    # Create a symlink for the .vimrc file if it exists
    if [ -f "$HOME/.vimrc" ]; then
      echo "Using existing .vimrc file" 
      ln -sf "$HOME/.vimrc" $FOLDER_USER_CONFIG/.vimrc 
    else
      echo "No .vimrc file found"
    fi

    # create a director for npm install -g packages
    export NPM_CONFIG_PREFIX="$PWD/npm_global"
    export PATH="$NPM_CONFIG_PREFIX/bin:$PATH"
    mkdir -p "$NPM_CONFIG_PREFIX"

    npm install -g @shopify/cli@3.45.1 @shopify/theme
    npm install
  '';
}

