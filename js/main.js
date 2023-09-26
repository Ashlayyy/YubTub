class App {
  api;
  switcher;

  constructor() {
    this.api = new API("./data/data.json");

    this.api.getData().then((data) => {
      this.switcher = new Switcher(this, data);
    });
  }
}

class API {
  url = "";
  data = null;

  constructor(newURL) {
    this.url = newURL;
  }

  async getData() {
    if (this.data === null) {
      await fetch(this.url)
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          this.data = data;
        });
    }
    return this.data;
  }
}

class Switcher {
  app;
  data;
  yubtub;
  cleaner;
  default = 0;

  constructor(app, data) {
    this.app = app;
    this.videos = data.videos;
    this.data = this.videos[this.default];

    this.yubtub = new YubTub(this.app, this.data);
    this.cleaner = new Cleaner();
  }

  updateDefault(newValue) {
    this.default = newValue;
    this.data = this.videos[this.default];

    this.cleaner.clean("body");
    this.yubtub = new YubTub(this.app, this.data);
  }
}

class Cleaner {
  clean(whereToClean) {
    document.querySelector(whereToClean).innerHTML = "";
  }
}

class YubTub {
  app;
  data;
  header;
  main;
  aside;
  renderer;

  constructor(app, data) {
    this.app = app;
    this.data = data;

    this.renderer = new Renderer();
    this.main = new Main(this, this.data);
    this.aside = new Aside(this, this.data);
  }
}

class Renderer {
  render(whereToRender, whatToRender) {
    document.querySelector(whereToRender).appendChild(whatToRender);
  }
}

class Main {
  yubtub;
  data;
  comments;
  video;

  constructor(yubtub, data) {
    this.yubtub = yubtub;
    this.data = data;

    this.mainElement = document.createElement("main");
    this.mainElement.classList.add("main");
    this.yubtub.renderer.render("body", this.mainElement);

    this.screenTitleElement = document.createElement('h2');
    this.screenTitleElement.classList = 'main__title';
    this.screenTitleElement.innerText = 'Twitchy';
    this.yubtub.renderer.render('main', this.screenTitleElement);

    this.sectionElement = document.createElement("section");
    this.sectionElement.classList.add("yubtub");
    this.yubtub.renderer.render(".main", this.sectionElement);

    this.videoElement = document.createElement("figure");
    this.videoElement.classList.add("video");
    this.yubtub.renderer.render(".yubtub", this.videoElement);

    this.overlaybuttonElement = document.createElement("button");
    this.overlaybuttonElement.classList =
      "video__button video__button--star video__button--overlay";
    this.yubtub.renderer.render(".video", this.overlaybuttonElement);

    this.overlaystarElement = document.createElement("i");
    this.overlaystarElement.classList = "fa-solid fa-star";
    this.yubtub.renderer.render(
      ".video__button--overlay",
      this.overlaystarElement
    );

    this.videoplayerElement = document.createElement("video");
    this.videoplayerElement.src = "./videos/" + this.data.video;
    this.videoplayerElement.classList = "video__player";
    this.videoplayerElement.controls = true;
    this.yubtub.renderer.render(".video", this.videoplayerElement);

    this.videobarElement = document.createElement("div");
    this.videobarElement.classList = "video__bar";
    this.yubtub.renderer.render(".video", this.videobarElement);

    this.videodetailsElement = document.createElement("div");
    this.videodetailsElement.classList = "video__details";
    this.yubtub.renderer.render(".video__bar", this.videodetailsElement);

    this.uploaderprofileElement = document.createElement("img");
    this.uploaderprofileElement.src = "./images/profilepicture.webp";
    this.uploaderprofileElement.alt = "Profile Picture";
    this.uploaderprofileElement.classList = "video__uploader";
    this.yubtub.renderer.render(".video__details", this.uploaderprofileElement);

    this.titleElement = document.createElement("p");
    this.titleElement.innerText = this.data.title;
    this.titleElement.classList = "video__title";
    this.yubtub.renderer.render(".video__details", this.titleElement);

    this.videocontrolsElement = document.createElement("div");
    this.videocontrolsElement.classList = "video__controls";
    this.yubtub.renderer.render(".video__bar", this.videocontrolsElement);

    this.starbuttonElement = document.createElement("button");
    this.starbuttonElement.classList =
      "video__button video__button--star video__button--controls";
    this.yubtub.renderer.render(".video__controls", this.starbuttonElement);

    this.stariconElement = document.createElement("i");
    this.stariconElement.classList = "fa-solid fa-star";
    this.yubtub.renderer.render(
      ".video__button--controls",
      this.stariconElement
    );

    const arrowButtonElement = document.createElement("button");
    arrowButtonElement.classList = "video__button video__button--arrow";
    this.yubtub.renderer.render(".video__controls", arrowButtonElement);

    const arrowIconElement = document.createElement("i");
    arrowIconElement.classList = "fa-solid fa-right-long";
    this.yubtub.renderer.render(".video__button--arrow", arrowIconElement);

    this.comments = new Comments(this, data);
    this.video = new Video();
  }
}

class Video {
  constructor() { }
}


class Comments {
  main;
  data;
  comment;

  constructor(main, data) {
    this.main = main;
    this.data = data;

    this.commentsSection = document.createElement("ul");
    this.commentsSection.classList = "comments";

    this.comments = this.data.comments;
    this.comments.forEach((commentText) => {
      this.commentElement = document.createElement("li");
      this.commentElement.classList = "comments__comment";

      this.profileImageElement = document.createElement("img");
      this.profileImageElement.src = "./images/profilepicture.webp";
      this.profileImageElement.alt = "Profile Picture";
      this.profileImageElement.classList = "comments__uploader";
      this.commentElement.appendChild(this.profileImageElement);

      this.commentTextElement = document.createTextNode(commentText);
      this.commentElement.appendChild(this.commentTextElement);

      this.commentsSection.appendChild(this.commentElement);
    });

    this.main.yubtub.renderer.render(".yubtub", this.commentsSection);

    this.comment = new Comment(this.main);
  }
}

class Comment {
  constructor() {
    this.commentsList = document.querySelector(".comments");

    this.inputField = document.createElement("input");
    this.inputField.type = "text";
    this.inputField.placeholder = "Add a comment";
    this.inputField.classList.add("comments__input");

    this.submitButton = document.createElement("button");
    this.submitButton.type = "button";
    this.submitButton.classList.add("comments__button");

    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-paper-plane");

    this.submitButton.appendChild(icon);

    this.commentItem = document.createElement("li");
    this.commentItem.classList.add(
      "comments__comment",
      "comments__comment--add"
    );

    this.commentItem.appendChild(this.inputField);
    this.commentItem.appendChild(this.submitButton);

    this.submitButton.addEventListener("click", this.addComment.bind(this));

    this.commentsList.appendChild(this.commentItem);
  }

  addComment() {
    const commentText = this.inputField.value;

    if (commentText.trim() !== "") {
      const newComment = document.createElement("li");
      newComment.classList.add("comments__comment");

      const profileImg = document.createElement("img");
      profileImg.src = "/images/profilepicture.webp";
      profileImg.alt = "Profile Picture";
      profileImg.classList.add("comments__uploader");

      newComment.appendChild(profileImg);
      newComment.appendChild(document.createTextNode(commentText));

      this.commentsList.insertBefore(newComment, this.commentItem);

      this.inputField.value = "";
    }
  }
}

class Aside {
  yubtub;
  data;
  nextVideo;
  htmlElement;

  constructor(yubtub, data) {
    this.yubtub = yubtub;
    this.data = data;
    this.htmlElement = document.createElement("aside");
    this.htmlElement.classList = "aside";
    this.yubtub.renderer.render("main", this.htmlElement);

    this.nextVideo = new NextVideo(this, data);
  }
}

class NextVideo {
  aside;
  htmlElement;

  constructor(aside, data) {
    this.aside = aside;
    this.data = data;

    for (let video of this.data.similar) {
      this.similarVideo = document.createElement("video");
      this.similarVideo.src = "./videos/" + video;
      this.similarVideo.classList.add("aside__video");
      this.aside.yubtub.renderer.render("aside", this.similarVideo);

      this.similarVideo.addEventListener("click", () => {
        const videoNumber = video.split("--")[1].split(".")[0];
        this.aside.yubtub.app.switcher.updateDefault(videoNumber - 1);
      });
    }
  }
}

const app = new App();
console.log(app);