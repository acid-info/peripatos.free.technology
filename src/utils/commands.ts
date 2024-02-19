import packageJson from "../../package.json";
import themes from "../../themes.json";
import { history } from "../stores/history";
import { theme } from "../stores/theme";

const hostname = window.location.hostname;

export const commands: Record<
  string,
  (args: string[]) => Promise<string> | string
> = {
  apply: async () => {
    const htmlString = "<template>Please email us at <a class=\"link\" href=\"mailto:contact@free.technology\">contact@free.technology</a></template>";

    return htmlString;
  },
  help: () => "Available commands: " + Object.keys(commands).join(", "),
  hostname: () => hostname,
  whoami: () => "guest",
  date: () => new Date().toLocaleString(),
  vi: () => `why use vi? try 'emacs'`,
  vim: () => `why use vim? try 'emacs'`,
  emacs: () => `why use emacs? try 'vim'`,
  echo: (args: string[]) => args.join(" "),
  sudo: (args: string[]) => {
    window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

    return `Permission denied: unable to run the command '${args[0]}' as root.`;
  },
  theme: (args: string[]) => {
    const usage = `Usage: theme [args].
    [args]:
      ls: list all available themes
      set: set theme to [theme]

    [Examples]:
      theme ls
      theme set gruvboxdark
    `;
    if (args.length === 0) {
      return usage;
    }

    switch (args[0]) {
      case "ls": {
        let result = themes.map((t) => t.name.toLowerCase()).join(", ");
        result += `You can preview all these themes here: ${packageJson.repository.url}/tree/master/docs/themes`;

        return result;
      }

      case "set": {
        if (args.length !== 2) {
          return usage;
        }

        const selectedTheme = args[1];
        const t = themes.find((t) => t.name.toLowerCase() === selectedTheme);

        if (!t) {
          return `Theme '${selectedTheme}' not found. Try 'theme ls' to see all available themes.`;
        }

        theme.set(t);

        return `Theme set to ${selectedTheme}`;
      }

      default: {
        return usage;
      }
    }
  },
  repo: () => {
    window.open(packageJson.repository.url, "_blank");

    return "Opening repository...";
  },
  clear: () => {
    history.set([]);

    return "";
  },
  email: () => {
    window.open(`mailto:${packageJson.author.email}`);

    return `Opening mailto:${packageJson.author.email}...`;
  },
  weather: async (args: string[]) => {
    const city = args.join("+");

    if (!city) {
      return "Usage: weather [city]. Example: weather Brussels";
    }

    const weather = await fetch(`https://wttr.in/${city}?ATm`);

    return weather.text();
  },
  exit: () => {
    return "Please close the tab to exit.";
  },
  curl: async (args: string[]) => {
    if (args.length === 0) {
      return "curl: no URL provided";
    }

    const url = args[0];

    try {
      const response = await fetch(url);
      const data = await response.text();

      return data;
    } catch (error) {
      return `curl: could not fetch URL ${url}. Details: ${error}`;
    }
  },
  banner: () => {
    function displayTextLetterByLetter(
      elementClass: any,
      text: any,
      minDelay = 1,
      maxDelay = 10
    ) {
      const elements = document.getElementsByClassName(elementClass);
      const element = elements[elements.length - 1]
      if (!element) return;

      // Append cursor initially
      const cursor = document.createElement("span");
      cursor.className = "cursor";
      element.appendChild(cursor);

      let currentIndex = 0;

      function displayNextLetter() {
        if (currentIndex < text.length) {
          let charToAdd = text[currentIndex];
          if (text.substr(currentIndex, 4) === "<br>") {
            charToAdd = "<br>";
            currentIndex += 4;
          } else {
            currentIndex++;
          }

          // Insert the character or <br> before the cursor
          if (charToAdd === "<br>") {
            const brElement = document.createElement("br");
            element?.insertBefore(brElement, cursor);
          } else {
            const textNode = document.createTextNode(charToAdd);
            element?.insertBefore(textNode, cursor);
          }

          let randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
          setTimeout(displayNextLetter, randomDelay);
        } else {
          // If all characters are added, remove the cursor
          cursor.style.display = "none";
          const baner = document.getElementsByClassName("banner")[0];
          if (baner) {
            // delete the banner
            baner.remove();
            // add the banner to the history
            history.update((h) => [...h, { command: "banner", outputs: [text] }]);
          }
        }
      }

      displayNextLetter();
    }
    
    const text = `██████╗ ███████╗██████╗ ██╗██████╗  █████╗ ████████╗ ██████╗ ███████╗
██╔══██╗██╔════╝██╔══██╗██║██╔══██╗██╔══██╗╚══██╔══╝██╔═══██╗██╔════╝
██████╔╝█████╗  ██████╔╝██║██████╔╝███████║   ██║   ██║   ██║███████╗
██╔═══╝ ██╔══╝  ██╔══██╗██║██╔═══╝ ██╔══██║   ██║   ██║   ██║╚════██║
██║     ███████╗██║  ██║██║██║     ██║  ██║   ██║   ╚██████╔╝███████║
╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝╚═╝     ╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚══════╝                                                  

-----------------------------------------------------------------------------

The Peripatos is a members-only network of builders, technologists, and
cypherpunks harnessing the transformational power of discovering together.
We actively work to advance the knowledge and development of cryptography,
privacy, and network states. We participate in regular roundtable
discussions that focus on curated topics. The objective of these meetings is
to share insights, generate new ideas, and network with one another. The
Peripatetic School — simply referred to as the Peripatos after the ancient
walkway of the Acropolis — was an informal institution of ancient Greece
where members conducted philosophical and scientific inquiries.

Type 'help' to see list of available commands.`;

    displayTextLetterByLetter("banner", text);

    return '';
  },
};
