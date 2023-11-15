import request from "supertest";
import { VideoType, app } from "../../src/settings";
describe("/videos", () => {
  let video: VideoType;

  beforeAll(async () => {
    await request(app).delete("/testing/all-data");
  });
  it("Get status 200 and found empty videos array", async () => {
    await request(app).get("/videos").expect(200, []);
  });
  it("Get status 404 and not found 1 video by id", async () => {
    await request(app).get("/videos/143424234246").expect(404);
  });
  it("Post status 400 and not created 1 video with uncorrect data", async () => {
    const result = await request(app)
      .post("/videos/")
      .send({ title: 123, author: 321, availableResolutions: 123 });
    expect(result.status).toBe(400);
    expect(result.body).toEqual({
      errorsMessages: [
        {
          message: expect.any(String),
          field: "title",
        },
        { message: expect.any(String), field: "author" },
        { message: expect.any(String), field: "availableResolutions" },
      ],
    });
  });
  it("Post status 201 and create 1 correct title and author", async () => {
    const result = await request(app)
      .post("/videos/")
      .send({
        title: "hello",
        author: "world",
        availableResolutions: ["P144"],
      });
    expect(result.status).toBe(201);
    video = result.body;
    expect(result.body).toEqual({
      id: expect.any(Number),
      title: "hello",
      author: "world",
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
      availableResolutions: expect.any(Array),
    });

    expect(result.body.createdAt < result.body.publicationDate).toBe(true);

    //expect(result.body.availableResolutions[0]).toBe("P144");
  });
  it("Put status 404 and not found uncorrect updated video", async () => {
    const result = await request(app)
      .put("/videos/" + 11111111111)
      .send({
        title: "string",
        author: "string",
        canBeDownloaded: true,
        minAgeRestriction: 11,
        createdAt: "string",
        publicationDate: "string",
        availableResolutions: ["P144"],
      })
      .expect(404);
  });
  it("Get status 200 and founded 1 video", async () => {
    const res = await request(app).get("/videos").expect(200);
    expect(res.body.length).toBe(1);
  });
  it("Post status 201 and created 1 video by id", async () => {
    const result = await request(app)
      .post("/videos/")
      .send({
        title: "hello",
        author: "world",
        availableResolutions: ["P1080"],
      });
    video = result.body;

    expect(result.status).toBe(201);

    expect(result.body).toEqual({
      id: expect.any(Number),
      author: "world",
      title: "hello",
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
      availableResolutions: expect.any(Array),
    });
  });
  it("Get status 200 and 2 founded videos", async () => {
    const res = await request(app).get("/videos").expect(200);
    expect(res.body.length).toBe(2);
  });
  it("Get status 200 and 1 founded video by id", async () => {
    const result = await request(app)
      .get("/videos/" + video.id)
      .expect(200);
    expect(result.body).toEqual(video);
  });
  it("Put status 204 and 1 updated video by id", async () => {
    const a = await request(app)
      .put(`/videos/${video.id}`)
      .send({
        title: "string",
        author: "string",
        canBeDownloaded: true,
        minAgeRestriction: 11,
        publicationDate: "string",
        availableResolutions: ["P144"],
      })
      .expect(204);

    const result = await request(app)
      .get("/videos/" + video.id)
      .expect(200);

    expect(result.body).toEqual({
      id: video.id,
      title: "string",
      author: "string",
      canBeDownloaded: true,
      minAgeRestriction: 11,
      createdAt: video.createdAt,
      publicationDate: "string",
      availableResolutions: ["P144"],
    });
  });
  it("Put status 400 and not updated video with uncorrect data", async () => {
    const result = await request(app)
      .put("/videos/" + video.id)
      .send({
        title: 123,
        author: 321,
        canBeDownLoaded: "no",
      });
    expect(result.status).toBe(400);
    expect(result.body).toEqual({
      errorsMessages: [
        { message: expect.any(String), field: "title" },
        { message: expect.any(String), field: "author" },
        { message: expect.any(String), field: "canBeDownloaded" },
      ],
    });
  });
  it("Delete status 204 and delete 1 video by id", async () => {
    const result = await request(app)
      .delete("/videos/" + video.id)
      .expect(204);
  });
  it("Delete status 404 and not deleted 1 video by id", async () => {
    await request(app).delete("/videos/1111111111111111").expect(404);
  });
});
