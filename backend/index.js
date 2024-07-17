const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

app.post("/", async (req, res) => {
  let nanoid;
  try {
    ({ nanoid } = await import("nanoid"));
  } catch (error) {
    console.error("Failed to load nanoid:", error);
    return res.status(500).json({ message: "Internal server error" });
  }

  const { originalUrl } = req.body;
  const uniqueId = nanoid(8);

  try {
    const url = await prisma.link.create({
      data: {
        originalUrl,
        shortUrl: uniqueId,
      },
    });

    const shortUrl = `http://localhost:4000/${uniqueId}`;
    res.status(200).json({
      success: true,
      data: { ...url, shortUrl },
      message: "URL shortened successfully",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Failed to shorten the URL",
    });
  }
});

app.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const url = await prisma.link.findUnique({
      where: {
        shortUrl,
      },
    });

    console.log(url);

    if (!url) {
      return res.status(404).send("Shortened URL not found");
    }

    res.redirect(url.originalUrl);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Failed to retrieve the URL",
    });
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
