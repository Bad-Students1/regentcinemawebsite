/* =========================================================
   EDIT YOUR SHOWTIMES HERE

   Add or remove movies from each day below.

   Each movie uses this format:

   {
     title: "Movie Name",
     rating: "Age Rating",
     warn: "Content warnings",
     times: ["2:30PM", "5:30PM"],
     poster: "Poster Image URL",
     imdb: "IMDb Movie Page URL"
   }

   EXAMPLE:

   {
     title: "Toy Story 5",
     rating: "G",
     warn: "",
     times: ["2:30PM", "5:30PM"],
     poster: "https://example.com/poster.jpg",
     imdb: "https://www.imdb.com/title/example/"
   }

   INFORMATION:

   title:
   The name of the movie.

   rating:
   The official age rating, such as G, PG, M, R13, R16, or R18.

   warn:
   Any content warnings you want displayed.
   Leave empty if there are none.

   times:
   Add each showtime inside quotation marks, separated by commas.

   poster:
   The direct URL to the movie poster image.

   imdb:
   The link to the movie's IMDb page.
   Clicking the movie poster will open this page in a new tab.

   If a day has no movies, leave it as:

   Wednesday: []

   Day names must be written exactly as:

   Monday
   Tuesday
   Wednesday
   Thursday
   Friday
   Saturday
   Sunday

   ========================================================= */


/* =========================
   WEEKLY MOVIE SCHEDULE
   ========================= */

const SCHEDULE = {

  Monday: [

    {
      title: "Obsession",
      rating: "R16",
      warn: "",
      times: ["2:30PM", "8:10PM"],
      poster: "https://image.tmdb.org/t/p/w300/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg",
      imdb: "https://www.imdb.com/title/tt37287335/"
    },

    {
      title: "Backrooms",
      rating: "M",
      warn: "",
      times: ["2:30PM", "7:30PM"],
      poster: "https://image.tmdb.org/t/p/w300/rhGx6E3qRNMgj3i5su2oukNHwIQ.jpg",
      imdb: "https://www.imdb.com/title/tt26657236/"
    },

    {
      title: "Weapons",
      rating: "R16",
      warn: "",
      times: ["6:00PM"],
      poster: "https://image.tmdb.org/t/p/w300/cpf7vsRZ0MYRQcnLWteD5jK9ymT.jpg",
      imdb: ""
    }

  ],


  Tuesday: [

    {
      title: "Obsession",
      rating: "R16",
      warn: "",
      times: ["10:30PM", "2:30PM", "8:10PM"],
      poster: "https://image.tmdb.org/t/p/w300/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg",
      imdb: "https://www.imdb.com/title/tt37287335/"
    }

  ],


  Wednesday: [

    {
      title: "Obsession",
      rating: "R16",
      warn: "",
      times: ["2:30PM", "8:10PM"],
      poster: "https://image.tmdb.org/t/p/w300/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg",
      imdb: "https://www.imdb.com/title/tt37287335/"
    },

    {
      title: "Backrooms",
      rating: "M",
      warn: "",
      times: ["2:30PM", "7:30PM"],
      poster: "https://image.tmdb.org/t/p/w300/rhGx6E3qRNMgj3i5su2oukNHwIQ.jpg",
      imdb: "https://www.imdb.com/title/tt26657236/"
    },

    {
      title: "Weapons",
      rating: "R16",
      warn: "",
      times: ["6:00PM"],
      poster: "https://image.tmdb.org/t/p/w300/cpf7vsRZ0MYRQcnLWteD5jK9ymT.jpg",
      imdb: ""
    }

  ],


  Thursday: [

    {
      title: "Obsession",
      rating: "R16",
      warn: "",
      times: ["2:30PM", "8:10PM"],
      poster: "https://image.tmdb.org/t/p/w300/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg",
      imdb: "https://www.imdb.com/title/tt37287335/"
    }

  ],


  Friday: [

    {
      title: "Obsession",
      rating: "R16",
      warn: "",
      times: ["2:30PM", "8:10PM"],
      poster: "https://image.tmdb.org/t/p/w300/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg",
      imdb: "https://www.imdb.com/title/tt37287335/"
    },

    {
      title: "Backrooms",
      rating: "M",
      warn: "",
      times: ["2:30PM", "7:30PM"],
      poster: "https://image.tmdb.org/t/p/w300/rhGx6E3qRNMgj3i5su2oukNHwIQ.jpg",
      imdb: "https://www.imdb.com/title/tt26657236/"
    },

    {
      title: "Toy Story 5",
      rating: "G",
      warn: "",
      times: ["8:00PM"],
      poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlIND99f2yirdCpkogEnIdQtBDEJ3klWI6keME9wCv8w&s=10",
      imdb: ""
    }

  ],


  Saturday: [

    {
      title: "Obsession",
      rating: "R16",
      warn: "",
      times: ["2:30PM", "8:10PM"],
      poster: "https://image.tmdb.org/t/p/w300/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg",
      imdb: "https://www.imdb.com/title/tt37287335/"
    }

  ],


  Sunday: [

    {
      title: "Obsession",
      rating: "R16",
      warn: "",
      times: ["2:30PM", "8:10PM"],
      poster: "https://image.tmdb.org/t/p/w300/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg",
      imdb: "https://www.imdb.com/title/tt37287335/"
    },

    {
      title: "The Life of Big E (Jeffery Epstein)",
      rating: "2+",
      warn: "Sex scenes",
      times: ["12:00AM", "5:38PM"],
      poster: "",
      imdb: ""
    }

  ]

};