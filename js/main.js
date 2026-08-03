"use strict";

/**
 * Configs
 */
var configs = (function() {
  var instance;
  var Singleton = function(options) {
    var options = options || Singleton.defaultOptions;
    for (var key in Singleton.defaultOptions) {
      this[key] = options[key] || Singleton.defaultOptions[key];
    }
  };
  Singleton.defaultOptions = {
    general_help:
      "Available commands:\n" +
      "Use TAB for autocomplete. Double-click to skip typing animation.\n" +
      "─────────────────────────────────────────────────",
    ls_help: "List files in the current directory.",
    cat_help: "Read and display file contents. Usage: cat <filename>",
    whoami_help: "Display info about the current user session.",
    date_help: "Print the system date and time.",
    help_help: "Show this help menu.",
    clear_help: "Clear the terminal screen.",
    reboot_help: "Reboot the terminal session.",
    cd_help: "Change the current working directory.",
    mv_help: "Move (rename) files.",
    rm_help: "Remove files or directories.",
    rmdir_help: "Remove empty directories.",
    touch_help: "Create an empty file or update timestamps.",
    sudo_help: "Execute a command as superuser.",
    blog_help: "List all blog posts. Usage: blog [post-number]",
    projects_help: "Show featured projects.",
    skills_help: "Display technical skills and proficiency.",
    welcome:
      "Welcome to saksham.me — Interactive Terminal Portfolio\n" +
      "─────────────────────────────────────────────────\n\n" +
      "  Software Engineer @ Google | IIT Jodhpur CSE '20\n" +
      "  Bengaluru, India\n\n" +
      "  I build scalable distributed systems, tinker with ML,\n" +
      "  and write about things I find fascinating in tech.\n\n" +
      "─────────────────────────────────────────────────\n" +
      "Type 'help' for commands, or open the sidebar (☰) for quick links.\n" +
      "Try: projects | skills | blog",
    internet_explorer_warning:
      "WARNING: Internet Explorer detected. This site works best in a modern browser.",
    welcome_file_name: "welcome_message.txt",
    invalid_command_message: "<value>: command not found. Type 'help' for available commands.",
    reboot_message:
      "Preparing to reboot...\n\n3...\n\n2...\n\n1...\n\nRebooting...\n\n",
    permission_denied_message: "Unable to '<value>', permission denied.",
    sudo_message: "Nice try. Unable to sudo using a web client. 🔒",
    usage: "Usage",
    file: "file",
    file_not_found: "File '<value>' not found. Try 'ls' to see available files.",
    username: "Username",
    hostname: "Host",
    platform: "Platform",
    accesible_cores: "Cores",
    language: "Language",
    value_token: "<value>",
    host: "saksham.me",
    user: "visitor",
    is_root: false,
    type_delay: 12
  };
  return {
    getInstance: function(options) {
      instance === void 0 && (instance = new Singleton(options));
      return instance;
    }
  };
})();

/**
 * Files
 */
var files = (function() {
  var instance;
  var Singleton = function(options) {
    var options = options || Singleton.defaultOptions;
    for (var key in Singleton.defaultOptions) {
      this[key] = options[key] || Singleton.defaultOptions[key];
    }
  };
  Singleton.defaultOptions = {
    "about.txt":
      "┌─────────────────────────────────────────────┐\n" +
      "│           SAKSHAM GUPTA                     │\n" +
      "│           Software Engineer @ Google        │\n" +
      "├─────────────────────────────────────────────┤\n" +
      "│                                             │\n" +
      "│  Based in Bengaluru, India.                 │\n" +
      "│  B.Tech CSE, IIT Jodhpur (2016-2020).      │\n" +
      "│                                             │\n" +
      "│  I build large-scale distributed systems    │\n" +
      "│  at Google. Passionate about systems        │\n" +
      "│  design, ML infrastructure, and developer   │\n" +
      "│  tooling.                                   │\n" +
      "│                                             │\n" +
      "│  When not coding, you'll find me riding     │\n" +
      "│  motorcycles through the Himalayas.         │\n" +
      "│                                             │\n" +
      "│  > cat contact.txt                          │\n" +
      "│  > projects                                 │\n" +
      "│  > skills                                   │\n" +
      "│  > blog                                     │\n" +
      "└─────────────────────────────────────────────┘",
    "contact.txt":
      "Email    : gupta.10@iitj.ac.in\n" +
      "LinkedIn : https://www.linkedin.com/in/saksham2410/\n" +
      "GitHub   : https://github.com/saksham2410/\n" +
      "Instagram: https://instagram.com/dotslashsaksham/",
    "LinkedIn.txt": "https://www.linkedin.com/in/saksham2410/",
    "GitHub.txt": "https://github.com/saksham2410/",
    "Instagram.txt": "https://instagram.com/dotslashsaksham/",
    "Hawkshaw.txt": "https://sakshamgupta.me/hawkshaw/"
  };
  return {
    getInstance: function(options) {
      instance === void 0 && (instance = new Singleton(options));
      return instance;
    }
  };
})();

/**
 * Blog posts
 */
var blogPosts = [
  { id: 1, slug: "raft-consensus", date: "2024-06-15", title: "Understanding Raft Consensus: Building Reliable Distributed Systems", file: "blog/posts/raft-consensus.md" },
  { id: 2, slug: "transformer-attention", date: "2024-08-22", title: "Transformer Attention Mechanisms: From Theory to Production", file: "blog/posts/transformer-attention.md" },
  { id: 3, slug: "grpc-vs-rest", date: "2024-10-03", title: "gRPC vs REST: When to Choose What at Scale", file: "blog/posts/grpc-vs-rest.md" },
  { id: 4, slug: "kubernetes-scheduling", date: "2024-12-11", title: "Deep Dive into Kubernetes Scheduling Algorithms", file: "blog/posts/kubernetes-scheduling.md" },
  { id: 5, slug: "wasm-edge", date: "2025-01-28", title: "WebAssembly at the Edge: The Future of Serverless Computing", file: "blog/posts/wasm-edge.md" },
  { id: 6, slug: "lock-free-data-structures", date: "2025-04-07", title: "Lock-Free Data Structures in Modern C++", file: "blog/posts/lock-free-data-structures.md" },
  { id: 7, slug: "llm-inference", date: "2025-07-19", title: "Optimizing LLM Inference: Quantization, KV Cache, and Beyond", file: "blog/posts/llm-inference.md" },
  { id: 8, slug: "ebpf-observability", date: "2025-10-02", title: "eBPF for Production Observability: A Practical Guide", file: "blog/posts/ebpf-observability.md" },
  { id: 9, slug: "rust-async-runtime", date: "2026-01-14", title: "Building an Async Runtime in Rust from Scratch", file: "blog/posts/rust-async-runtime.md" }
];

/**
 * Projects data
 */
var projectsData = [
  {
    name: "Hawkshaw",
    desc: "Advanced Android RAT with VueJS/NodeJS web client. Real-time device monitoring, GPS tracking, and data extraction.",
    tech: "Android · VueJS · NodeJS · WebSockets",
    link: "https://sakshamgupta.me/hawkshaw/"
  },
  {
    name: "Ekolo",
    desc: "Eco-friendly e-mobility platform — electric bike rentals for last-mile connectivity with zero emissions.",
    tech: "Android · Firebase · Google Maps · Material Design",
    link: "https://sakshamgupta.me/Ekolo/"
  },
  {
    name: "Spiti Expedition",
    desc: "Immersive parallax website documenting a 7-day Himalayan motorcycle ride through Spiti Valley.",
    tech: "Parallax · CSS Animations · Storytelling",
    link: "https://sakshamgupta.me/spiti/"
  }
];

/**
 * Simple markdown parser
 */
function parseMarkdown(md) {
  // Remove frontmatter
  md = md.replace(/^---[\s\S]*?---\n*/m, "");

  var html = md
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr>')
    // Unordered lists
    .replace(/^[*-] (.+)$/gm, '<li>$1</li>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // Wrap in paragraph
  html = '<p>' + html + '</p>';
  // Clean up
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[123]>)/g, '$1');
  html = html.replace(/(<\/h[123]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<pre>)/g, '$1');
  html = html.replace(/(<\/pre>)<\/p>/g, '$1');
  html = html.replace(/<p>(<blockquote>)/g, '$1');
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
  html = html.replace(/<p>(<hr>)<\/p>/g, '$1');
  html = html.replace(/<p>(<li>)/g, '<ul>$1');
  html = html.replace(/(<\/li>)<\/p>/g, '$1</ul>');

  return html;
}

var main = (function() {
  /**
   * Aux functions
   */
  var isUsingIE =
    window.navigator.userAgent.indexOf("MSIE ") > 0 ||
    !!navigator.userAgent.match(/Trident.*rv\:11\./);

  var ignoreEvent = function(event) {
    event.preventDefault();
    event.stopPropagation();
  };

  var scrollToBottom = function() {
    window.scrollTo(0, document.body.scrollHeight);
  };

  var isURL = function(str) {
    return (
      (str.startsWith("http") || str.startsWith("www")) &&
      str.indexOf(" ") === -1 &&
      str.indexOf("\n") === -1
    );
  };

  /**
   * Status bar clock
   */
  function updateClock() {
    var el = document.getElementById("statusTime");
    if (el) {
      var now = new Date();
      el.textContent = now.toLocaleTimeString("en-US", { hour12: false });
    }
  }
  setInterval(updateClock, 1000);

  /**
   * Model
   */
  var InvalidArgumentException = function(message) {
    this.message = message;
    if ("captureStackTrace" in Error) {
      Error.captureStackTrace(this, InvalidArgumentException);
    } else {
      this.stack = new Error().stack;
    }
  };
  InvalidArgumentException.prototype = Object.create(Error.prototype);
  InvalidArgumentException.prototype.name = "InvalidArgumentException";
  InvalidArgumentException.prototype.constructor = InvalidArgumentException;

  var cmds = {
    LS: { value: "ls", help: configs.getInstance().ls_help },
    CAT: { value: "cat", help: configs.getInstance().cat_help },
    WHOAMI: { value: "whoami", help: configs.getInstance().whoami_help },
    DATE: { value: "date", help: configs.getInstance().date_help },
    HELP: { value: "help", help: configs.getInstance().help_help },
    CLEAR: { value: "clear", help: configs.getInstance().clear_help },
    REBOOT: { value: "reboot", help: configs.getInstance().reboot_help },
    CD: { value: "cd", help: configs.getInstance().cd_help },
    MV: { value: "mv", help: configs.getInstance().mv_help },
    RM: { value: "rm", help: configs.getInstance().rm_help },
    RMDIR: { value: "rmdir", help: configs.getInstance().rmdir_help },
    TOUCH: { value: "touch", help: configs.getInstance().touch_help },
    SUDO: { value: "sudo", help: configs.getInstance().sudo_help },
    BLOG: { value: "blog", help: configs.getInstance().blog_help },
    PROJECTS: { value: "projects", help: configs.getInstance().projects_help },
    SKILLS: { value: "skills", help: configs.getInstance().skills_help }
  };

  var Terminal = function(
    prompt, cmdLine, output, sidenav, profilePic,
    user, host, root, outputTimer
  ) {
    if (!(prompt instanceof Node) || prompt.nodeName.toUpperCase() !== "DIV") {
      throw new InvalidArgumentException("Invalid value " + prompt + " for argument 'prompt'.");
    }
    if (!(cmdLine instanceof Node) || cmdLine.nodeName.toUpperCase() !== "INPUT") {
      throw new InvalidArgumentException("Invalid value " + cmdLine + " for argument 'cmdLine'.");
    }
    if (!(output instanceof Node) || output.nodeName.toUpperCase() !== "DIV") {
      throw new InvalidArgumentException("Invalid value " + output + " for argument 'output'.");
    }
    if (!(sidenav instanceof Node) || sidenav.nodeName.toUpperCase() !== "DIV") {
      throw new InvalidArgumentException("Invalid value " + sidenav + " for argument 'sidenav'.");
    }
    if (!(profilePic instanceof Node) || profilePic.nodeName.toUpperCase() !== "IMG") {
      throw new InvalidArgumentException("Invalid value " + profilePic + " for argument 'profilePic'.");
    }
    typeof user === "string" &&
      typeof host === "string" &&
      (this.completePrompt = user + "@" + host + ":~" + (root ? "#" : "$"));
    this.profilePic = profilePic;
    this.prompt = prompt;
    this.cmdLine = cmdLine;
    this.output = output;
    this.sidenav = sidenav;
    this.sidenavOpen = false;
    this.sidenavElements = [];
    this.typeSimulator = new TypeSimulator(outputTimer, output);
    this.commandHistory = [];
    this.historyIndex = -1;
  };

  Terminal.prototype.type = function(text, callback) {
    this.typeSimulator.type(text, callback);
  };

  Terminal.prototype.exec = function() {
    var command = this.cmdLine.value;
    this.cmdLine.value = "";
    this.prompt.textContent = "";
    this.output.innerHTML +=
      '<span class="prompt-color">' +
      this.completePrompt +
      "</span> " +
      command +
      "<br/>";
  };

  Terminal.prototype.init = function() {
    this.sidenav.addEventListener("click", ignoreEvent);
    this.cmdLine.disabled = true;
    this.sidenavElements.forEach(function(elem) {
      elem.disabled = true;
    });
    this.prepareSideNav();
    this.lock();
    document.body.addEventListener(
      "click",
      function(event) {
        if (this.sidenavOpen) {
          this.handleSidenav(event);
        }
        this.focus();
      }.bind(this)
    );
    this.cmdLine.addEventListener(
      "keydown",
      function(event) {
        if (event.which === 13 || event.keyCode === 13) {
          this.handleCmd();
          ignoreEvent(event);
        } else if (event.which === 9 || event.keyCode === 9) {
          this.handleFill();
          ignoreEvent(event);
        } else if (event.which === 38 || event.keyCode === 38) {
          // Up arrow — command history
          if (this.commandHistory.length > 0 && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            this.cmdLine.value = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
          }
          ignoreEvent(event);
        } else if (event.which === 40 || event.keyCode === 40) {
          // Down arrow — command history
          if (this.historyIndex > 0) {
            this.historyIndex--;
            this.cmdLine.value = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
          } else {
            this.historyIndex = -1;
            this.cmdLine.value = "";
          }
          ignoreEvent(event);
        }
      }.bind(this)
    );
    this.reset();
    updateClock();
  };

  Terminal.makeElementDisappear = function(element) {
    element.style.opacity = 0;
    element.style.transform = "translateX(-300px)";
  };

  Terminal.makeElementAppear = function(element) {
    element.style.opacity = 1;
    element.style.transform = "translateX(0)";
  };

  Terminal.prototype.prepareSideNav = function() {
    var capFirst = function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };
    for (var file in files.getInstance()) {
      var element = document.createElement("button");
      Terminal.makeElementDisappear(element);
      element.onclick = function(file, event) {
        this.handleSidenav(event);
        this.cmdLine.value = "cat " + file + " ";
        this.handleCmd();
      }.bind(this, file);
      element.appendChild(
        document.createTextNode(
          capFirst(file.replace(/\.[^/.]+$/, "").replace(/_/g, " "))
        )
      );
      this.sidenav.appendChild(element);
      this.sidenavElements.push(element);
    }
    // Add extra sidebar buttons for new commands
    var extraCmds = [
      { label: "Projects", cmd: "projects" },
      { label: "Skills", cmd: "skills" },
      { label: "Blog", cmd: "blog" }
    ];
    extraCmds.forEach(function(item) {
      var el = document.createElement("button");
      Terminal.makeElementDisappear(el);
      el.onclick = function(event) {
        this.handleSidenav(event);
        this.cmdLine.value = item.cmd;
        this.handleCmd();
      }.bind(this);
      el.appendChild(document.createTextNode(item.label));
      this.sidenav.appendChild(el);
      this.sidenavElements.push(el);
    }.bind(this));

    document
      .getElementById("sidenavBtn")
      .addEventListener("click", this.handleSidenav.bind(this));
  };

  Terminal.prototype.handleSidenav = function(event) {
    if (this.sidenavOpen) {
      this.profilePic.style.opacity = 0;
      this.sidenavElements.forEach(Terminal.makeElementDisappear);
      this.sidenav.style.width = "56px";
      document.getElementById("sidenavBtn").innerHTML = "&#9776;";
      this.sidenavOpen = false;
    } else {
      this.sidenav.style.width = "280px";
      this.sidenavElements.forEach(Terminal.makeElementAppear);
      document.getElementById("sidenavBtn").innerHTML = "&times;";
      this.profilePic.style.opacity = 1;
      this.sidenavOpen = true;
    }
    document.getElementById("sidenavBtn").blur();
    ignoreEvent(event);
  };

  Terminal.prototype.lock = function() {
    this.exec();
    this.cmdLine.blur();
    this.cmdLine.disabled = true;
    this.sidenavElements.forEach(function(elem) {
      elem.disabled = true;
    });
  };

  Terminal.prototype.unlock = function() {
    this.cmdLine.disabled = false;
    this.prompt.textContent = this.completePrompt;
    this.sidenavElements.forEach(function(elem) {
      elem.disabled = false;
    });
    scrollToBottom();
    this.focus();
  };

  Terminal.prototype.handleFill = function() {
    var cmdComponents = this.cmdLine.value.trim().split(" ");
    if (
      cmdComponents.length <= 1 ||
      (cmdComponents.length === 2 && cmdComponents[0] === cmds.CAT.value)
    ) {
      this.lock();
      var possibilities = [];
      if (cmdComponents[0].toLowerCase() === cmds.CAT.value) {
        if (cmdComponents.length === 1) {
          cmdComponents[1] = "";
        }
        if (
          configs.getInstance().welcome_file_name.startsWith(cmdComponents[1].toLowerCase())
        ) {
          possibilities.push(cmds.CAT.value + " " + configs.getInstance().welcome_file_name);
        }
        for (var file in files.getInstance()) {
          if (file.toLowerCase().startsWith(cmdComponents[1].toLowerCase())) {
            possibilities.push(cmds.CAT.value + " " + file);
          }
        }
      } else {
        for (var command in cmds) {
          if (cmds[command].value.startsWith(cmdComponents[0].toLowerCase())) {
            possibilities.push(cmds[command].value);
          }
        }
      }
      if (possibilities.length === 1) {
        this.cmdLine.value = possibilities[0] + " ";
        this.unlock();
      } else if (possibilities.length > 1) {
        this.type(
          possibilities.join("\n"),
          function() {
            this.cmdLine.value = cmdComponents.join(" ");
            this.unlock();
          }.bind(this)
        );
      } else {
        this.cmdLine.value = cmdComponents.join(" ");
        this.unlock();
      }
    }
  };

  Terminal.prototype.handleCmd = function() {
    var cmdLine = this.cmdLine.value.trim();
    var cmdComponents = cmdLine.split(" ");

    // Save to history
    if (cmdLine) {
      this.commandHistory.push(cmdLine);
      this.historyIndex = -1;
    }

    this.lock();
    switch (cmdComponents[0]) {
      case cmds.CAT.value:
        this.cat(cmdComponents);
        break;
      case cmds.LS.value:
        this.ls();
        break;
      case cmds.WHOAMI.value:
        this.whoami();
        break;
      case cmds.DATE.value:
        this.date();
        break;
      case cmds.HELP.value:
        this.help();
        break;
      case cmds.CLEAR.value:
        this.clear();
        break;
      case cmds.REBOOT.value:
        this.reboot();
        break;
      case cmds.BLOG.value:
        this.blog(cmdComponents);
        break;
      case cmds.PROJECTS.value:
        this.projects();
        break;
      case cmds.SKILLS.value:
        this.skills();
        break;
      case cmds.CD.value:
      case cmds.MV.value:
      case cmds.RMDIR.value:
      case cmds.RM.value:
      case cmds.TOUCH.value:
        this.permissionDenied(cmdComponents);
        break;
      case cmds.SUDO.value:
        this.sudo();
        break;
      default:
        this.invalidCommand(cmdComponents);
        break;
    }
  };

  Terminal.prototype.cat = function(cmdComponents) {
    var result;
    if (cmdComponents.length <= 1) {
      result = configs.getInstance().usage + ": " + cmds.CAT.value + " <" + configs.getInstance().file + ">";
    } else if (
      !cmdComponents[1] ||
      (!cmdComponents[1] === configs.getInstance().welcome_file_name ||
        !files.getInstance().hasOwnProperty(cmdComponents[1]))
    ) {
      result = configs.getInstance().file_not_found.replace(configs.getInstance().value_token, cmdComponents[1]);
    } else {
      result =
        cmdComponents[1] === configs.getInstance().welcome_file_name
          ? configs.getInstance().welcome
          : files.getInstance()[cmdComponents[1]];
    }
    this.type(result, this.unlock.bind(this));
  };

  Terminal.prototype.ls = function() {
    var result = ".\n..\n" + configs.getInstance().welcome_file_name + "\n";
    for (var file in files.getInstance()) {
      result += file + "\n";
    }
    result += "blog/\n";
    this.type(result.trim(), this.unlock.bind(this));
  };

  Terminal.prototype.blog = function(cmdComponents) {
    var self = this;
    if (cmdComponents.length <= 1) {
      // List all posts
      var result = "┌─────────────────────────────────────────────────────────────┐\n";
      result +=    "│  BLOG — Thoughts on engineering, systems & technology      │\n";
      result +=    "├────┬────────────┬────────────────────────────────────────────┤\n";
      blogPosts.forEach(function(post) {
        var num = String(post.id).length === 1 ? " " + post.id : String(post.id);
        var title = post.title;
        if (title.length > 42) title = title.substring(0, 39) + "...";
        result += "│ " + num + " │ " + post.date + " │ " + title;
        var padding = 42 - title.length;
        for (var i = 0; i < padding; i++) result += " ";
        result += "│\n";
      });
      result += "└────┴────────────┴────────────────────────────────────────────┘\n";
      result += "\nUsage: blog <number> to read a post (e.g. 'blog 1')";
      self.type(result, self.unlock.bind(self));
    } else {
      var postNum = parseInt(cmdComponents[1]);
      var post = blogPosts.find(function(p) { return p.id === postNum; });
      if (!post) {
        self.type("Post not found. Use 'blog' to see available posts.", self.unlock.bind(self));
        return;
      }
      // Fetch the markdown file
      fetch(post.file)
        .then(function(res) { return res.text(); })
        .then(function(md) {
          var html = '<div class="blog-content">';
          html += '<h1>' + post.title + '</h1>';
          html += '<p style="color: rgba(14,245,64,0.4); font-size: 12px;">' + post.date + '</p>';
          html += parseMarkdown(md);
          html += '</div>';
          self.output.innerHTML +=
            '<span class="prompt-color">' + self.completePrompt + '</span> blog ' + postNum + '<br/>';
          self.output.innerHTML += html;
          scrollToBottom();
          self.unlock();
        })
        .catch(function() {
          self.type("Error loading blog post. Try again later.", self.unlock.bind(self));
        });
    }
  };

  Terminal.prototype.projects = function() {
    var result = "┌─────────────────────────────────────────────────────────┐\n";
    result +=    "│  FEATURED PROJECTS                                     │\n";
    result +=    "└─────────────────────────────────────────────────────────┘\n\n";
    projectsData.forEach(function(proj, i) {
      result += "  [" + (i + 1) + "] " + proj.name + "\n";
      result += "      " + proj.desc + "\n";
      result += "      Tech: " + proj.tech + "\n";
      result += "      Link: " + proj.link + "\n\n";
    });
    this.type(result.trim(), this.unlock.bind(this));
  };

  Terminal.prototype.skills = function() {
    var skillsData = [
      { name: "Distributed Systems", level: 9 },
      { name: "System Design      ", level: 9 },
      { name: "Go / Python / C++  ", level: 8 },
      { name: "Machine Learning   ", level: 7 },
      { name: "Kubernetes / Cloud ", level: 8 },
      { name: "Data Structures    ", level: 9 },
      { name: "gRPC / Protobuf    ", level: 8 },
      { name: "JavaScript / Web   ", level: 7 },
      { name: "Deep Learning      ", level: 6 },
      { name: "DevOps / CI-CD     ", level: 7 }
    ];
    var result = "┌─────────────────────────────────────────────────┐\n";
    result +=    "│  TECHNICAL SKILLS                               │\n";
    result +=    "└─────────────────────────────────────────────────┘\n\n";
    skillsData.forEach(function(skill) {
      var bar = "";
      for (var i = 0; i < 10; i++) {
        bar += i < skill.level ? "█" : "░";
      }
      result += "  " + skill.name + "  " + bar + "  " + skill.level + "/10\n";
    });
    this.type(result.trim(), this.unlock.bind(this));
  };

  Terminal.prototype.sudo = function() {
    this.type(configs.getInstance().sudo_message, this.unlock.bind(this));
  };

  Terminal.prototype.whoami = function() {
    var result =
      configs.getInstance().username + ": " + configs.getInstance().user + "\n" +
      configs.getInstance().hostname + ": " + configs.getInstance().host + "\n" +
      configs.getInstance().platform + ": " + navigator.platform + "\n" +
      configs.getInstance().accesible_cores + ": " + navigator.hardwareConcurrency + "\n" +
      configs.getInstance().language + ": " + navigator.language;
    this.type(result, this.unlock.bind(this));
  };

  Terminal.prototype.date = function() {
    this.type(new Date().toString(), this.unlock.bind(this));
  };

  Terminal.prototype.help = function() {
    var result = configs.getInstance().general_help + "\n\n";
    for (var cmd in cmds) {
      var val = cmds[cmd].value;
      var padding = 12 - val.length;
      var pad = "";
      for (var i = 0; i < padding; i++) pad += " ";
      result += "  " + val + pad + cmds[cmd].help + "\n";
    }
    this.type(result.trim(), this.unlock.bind(this));
  };

  Terminal.prototype.clear = function() {
    this.output.textContent = "";
    this.prompt.textContent = "";
    this.prompt.textContent = this.completePrompt;
    this.unlock();
  };

  Terminal.prototype.reboot = function() {
    this.type(configs.getInstance().reboot_message, this.reset.bind(this));
  };

  Terminal.prototype.reset = function() {
    this.output.textContent = "";
    this.prompt.textContent = "";
    if (this.typeSimulator) {
      this.type(
        configs.getInstance().welcome +
          (isUsingIE ? "\n" + configs.getInstance().internet_explorer_warning : ""),
        function() {
          this.unlock();
        }.bind(this)
      );
    }
  };

  Terminal.prototype.permissionDenied = function(cmdComponents) {
    this.type(
      configs.getInstance().permission_denied_message.replace(
        configs.getInstance().value_token,
        cmdComponents[0]
      ),
      this.unlock.bind(this)
    );
  };

  Terminal.prototype.invalidCommand = function(cmdComponents) {
    this.type(
      configs.getInstance().invalid_command_message.replace(
        configs.getInstance().value_token,
        cmdComponents[0]
      ),
      this.unlock.bind(this)
    );
  };

  Terminal.prototype.focus = function() {
    this.cmdLine.focus();
  };

  var TypeSimulator = function(timer, output) {
    var timer = parseInt(timer);
    if (timer === Number.NaN || timer < 0) {
      throw new InvalidArgumentException("Invalid value " + timer + " for argument 'timer'.");
    }
    if (!(output instanceof Node)) {
      throw new InvalidArgumentException("Invalid value " + output + " for argument 'output'.");
    }
    this.timer = timer;
    this.output = output;
  };

  TypeSimulator.prototype.type = function(text, callback) {
    if (isURL(text)) {
      window.open(text);
    }
    var i = 0;
    var output = this.output;
    var timer = this.timer;
    var skipped = false;
    var skip = function() {
      skipped = true;
    }.bind(this);
    document.addEventListener("dblclick", skip);
    (function typer() {
      if (i < text.length) {
        var char = text.charAt(i);
        var isNewLine = char === "\n";
        output.innerHTML += isNewLine ? "<br/>" : char;
        i++;
        if (!skipped) {
          setTimeout(typer, isNewLine ? timer * 2 : timer);
        } else {
          output.innerHTML +=
            text.substring(i).replace(new RegExp("\n", "g"), "<br/>") + "<br/>";
          document.removeEventListener("dblclick", skip);
          callback();
        }
      } else if (callback) {
        output.innerHTML += "<br/>";
        document.removeEventListener("dblclick", skip);
        callback();
      }
      scrollToBottom();
    })();
  };

  return {
    listener: function() {
      new Terminal(
        document.getElementById("prompt"),
        document.getElementById("cmdline"),
        document.getElementById("output"),
        document.getElementById("sidenav"),
        document.getElementById("profilePic"),
        configs.getInstance().user,
        configs.getInstance().host,
        configs.getInstance().is_root,
        configs.getInstance().type_delay
      ).init();
    }
  };
})();

window.onload = main.listener;
