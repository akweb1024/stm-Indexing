# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11";

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.firebase-tools # Added firebase-tools for firebase CLI commands
  ];

  # Sets environment variables in the workspace
  env = {
    EXPO_USE_FAST_RESOLVER = "1";
  };

  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "msjsdiag.vscode-react-native"
      "dbaeumer.vscode-eslint" # for linting
    ];

    workspace = {
      # Runs when a workspace is first created with this `dev.nix` file
      onCreate = {
        npm-install = "npm install";
        # also install dependencies for functions
        npm-install-functions = "cd functions && npm install && cd ..";
      };

      # Runs when the workspace is started
      onStart = {
        # check firebase version
        firebase-version = "firebase --version";
      };
    };

    # Defines the previews shown in the IDX workspace
    previews = {
      enable = true;
      previews = [
        {
          id = "web";
          label = "Web App";
          port = 5173;
          command = "npm run dev";
        }
      ];
    };
  };
}
