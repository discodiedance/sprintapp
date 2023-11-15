import express, { Request, Response, request, response } from "express";

export const app = express();

app.use(express.json());

type RequestWithParams<P> = Request<P, {}, {}, {}>;

type RequestWithBody<B> = Request<{}, {}, B, {}>;

type RequestWithBodyAndParams<P, B> = Request<P, {}, B, {}>;

type CreateVideoDto = {
  title: string;
  author: string;
  availableResolutions: typeof availableResolutions;
};

type ErrorType = {
  errorsMessages: ErorMessageType[];
};

type ErorMessageType = {
  field: string;
  message: string;
};

const availableResolutions = [
  "P144",
  "P240",
  "P360",
  "P480",
  "P720",
  "P1080",
  "P1440",
  "P2160",
];

export type VideoType = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: typeof availableResolutions;
};

const videos: VideoType[] = [
  {
    id: 1,
    title: "string",
    author: "string",
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: "2023-11-08T12:16:55.998Z",
    publicationDate: "2023-11-08T12:16:55.998Z",
    availableResolutions: ["P144"],
  },
];

app.get("/videos", (req: Request, res: Response) => {
  res.status(200).send(videos);
});

type Params = {
  id: string;
};

app.get("/videos/:id", (req: RequestWithParams<Params>, res: Response) => {
  const id = +req.params.id;

  const video = videos.find((v) => v.id == id);

  if (!video) {
    res.sendStatus(404);
    return;
  }
  res.send(video);
});

app.post("/videos", (req: RequestWithBody<CreateVideoDto>, res: Response) => {
  let errors: ErrorType = {
    errorsMessages: [],
  };

  let { title, author, availableResolutions } = req.body;

  if (typeof title !== "string") {
    errors.errorsMessages.push({ message: "Invalid title", field: "title" });
  } else if (title.trim().length < 1 || title.trim().length > 40) {
    errors.errorsMessages.push({ message: "Invalid title", field: "title" });
  }

  if (typeof author !== "string") {
    errors.errorsMessages.push({ message: "Invalid title", field: "author" });
  } else if (author.trim().length < 1 || author.trim().length > 20) {
    errors.errorsMessages.push({ message: "Invalid author", field: "author" });
  }
  if (Array.isArray(availableResolutions)) {
    availableResolutions.map((r) => {
      !availableResolutions.includes(r) &&
        errors.errorsMessages.push({
          message: "Invalid availableResolutions",
          field: "availableResolutions",
        });
    });
  } else {
    availableResolutions = [];
  }

  if (errors.errorsMessages.length) {
    res.status(400).send(errors);
    return;
  }

  const createdAt = new Date();
  const puiblicationDate = new Date();

  puiblicationDate.setDate(createdAt.getDate() + 1);

  const newVideo = {
    id: +new Date(),
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: createdAt.toISOString(),
    publicationDate: puiblicationDate.toISOString(),
    title,
    author,
    availableResolutions,
  };

  videos.push(newVideo);

  res.status(201).send(newVideo);
});

type UpdateVideoDto = {
  id: number;
  title: string;
  author: string;
  availableResolutions: typeof availableResolutions;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  publicationDate: string;
};

app.put(
  "/videos/:id",
  (req: RequestWithBodyAndParams<Params, UpdateVideoDto>, res: Response) => {
    const id = +req.params.id;

    let errors: ErrorType = {
      errorsMessages: [],
    };

    let {
      title,
      author,
      availableResolutions,
      canBeDownloaded,
      minAgeRestriction,
      publicationDate,
    } = req.body;

    if (
      !title ||
      typeof title !== "string" ||
      title.trim().length < 1 ||
      title.trim().length > 40
    ) {
      errors.errorsMessages.push({ message: "Invalid title", field: "title" });
    }

    if (
      !author ||
      typeof author !== "string" ||
      author.trim().length < 1 ||
      author.trim().length > 20
    ) {
      errors.errorsMessages.push({
        message: "Invalid author",
        field: "author",
      });
    }
    if (Array.isArray(availableResolutions)) {
      availableResolutions.map((r) => {
        !availableResolutions.includes(r) &&
          errors.errorsMessages.push({
            message: "Invalid availableResolutions",
            field: "availableResolutions",
          });
      });
    } else {
      availableResolutions = [];
    }
    if (typeof canBeDownloaded == "undefined") {
      canBeDownloaded = false;
    }

    if (
      typeof minAgeRestriction !== "undefined" &&
      typeof minAgeRestriction == "number"
    ) {
      minAgeRestriction < 1 ||
        (minAgeRestriction > 18 &&
          errors.errorsMessages.push({
            message: "Invalid minAgeRestriction",
            field: "minAgeRestriction",
          }));
    } else {
      minAgeRestriction = null;
    }
    if (errors.errorsMessages.length) {
      res.status(400).send(errors);
      return;
    }

    //const videoIndex = videos.findIndex((v) => v.id == id);

    const video = videos.find((v) => v.id == id);

    if (!video) {
      res.sendStatus(404);
      return;
    }

    video.author = author;
    video.title = title;
    video.canBeDownloaded = canBeDownloaded;
    video.minAgeRestriction = minAgeRestriction;
    video.availableResolutions = availableResolutions;
    video.publicationDate = publicationDate;

    //const updatedItem = {
    // ...video,
    //  canBeDownloaded,
    // minAgeRestriction,
    //  title,
    //  author,
    //  availableResolutions,
    //  publicationDate: publicationDate
    //    ? publicationDate
    //    : video.publicationDate,
    //  };
    // videos.splice(videoIndex, 1, updatedItem);
    console.log(req.body);
    return res.sendStatus(204);
  }
);

app.delete("/testing/all-data", (req: Request, res: Response) => {
  videos.length = 0;
  res.sendStatus(204);
});

app.delete("/videos/:id", (req: RequestWithParams<Params>, res: Response) => {
  const id = +req.params.id;
  const videoIndex = videos.findIndex((v) => v.id == id);
  if (videoIndex == -1) {
    res.sendStatus(404);
    return;
  }
  videos.splice(videoIndex, 1);
  res.sendStatus(204);
});
