/* =========================================================
   EDIT YOUR SHOWTIMES HERE — once a week, fill in all 7 days
   below with that week's lineup. The site automatically works
   out which day is "today" and which is "tomorrow" and shows
   the right one — you don't need to touch this again until
   next week's titles change.

   Day names must be spelled exactly as shown (Monday, Tuesday,
   Wednesday, Thursday, Friday, Saturday, Sunday). If a cinema
   is closed or has nothing on for a day, just leave its list
   empty: [ ]  — the site will show a friendly "nothing on"
   message instead of breaking.

   The setup for these is 
   { title:"movie name here", rating:"age rating here", warn:"warning for movies here", times:[showtimes here], poster:"link to poster here" }
    How to set it up
    movie name here: you will insert the name for the movie here set up by just putting in the movie name for this section e.g. Toy Story 5
    age rating here: here you will put the age rating in the and what you put will show up (leave blank if you don't want anything) e.g. R16
    warnings for movies here: Put the warnings that you want to show for the movie e.g Sexual themes, violence
    showtimes here: Here you will put the movie show times in quotation marks with a comma seperating each one e.g "2:30PM", "5:30PM"
    link to poster here: Here you will put the directory or web link to the poster that will show for the movie e.g https://movieposterimg.png or /images/posters/poster.png

    Filled out one
    { title:"Obssesion", rating:"R16", warn:"Violence, horror, sex scenes, offensive language, suicide & content that may disturb", times:["2:30PM", "5:30PM"], poster:"https://image.tmdb.org/t/p/w300/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg" }
    Each one of the above lines are a separate movie on a day and you will seperate them with a comma 
    { title:"Backrooms", rating:"M", warn:"", times:["2:30PM","7:30PM"], poster:"https://image.tmdb.org/t/p/w300/rhGx6E3qRNMgj3i5su2oukNHwIQ.jpg" },
    { title:"Weapons", rating:"R16", warn:"", times:["6:00PM"], poster:"https://image.tmdb.org/t/p/w300/cpf7vsRZ0MYRQcnLWteD5jK9ymT.jpg" }

   ========================================================= */
/* ===SCHEDULE_START=== */
const SCHEDULE = {
  Monday: [
    { title:"Obsession", rating:"R16", warn:"", times:["2:30PM","8:10PM"], poster:"https://image.tmdb.org/t/p/w300/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg" },
    { title:"Backrooms", rating:"M", warn:"", times:["2:30PM","7:30PM"], poster:"https://image.tmdb.org/t/p/w300/rhGx6E3qRNMgj3i5su2oukNHwIQ.jpg" },
    { title:"Weapons", rating:"R16", warn:"", times:["6:00PM"], poster:"https://image.tmdb.org/t/p/w300/cpf7vsRZ0MYRQcnLWteD5jK9ymT.jpg" }
  ],
  Tuesday: [
    { title:"Obsession", rating:"R16", warn:"", times:["10:30PM","2:30PM","8:10PM"], poster:"https://image.tmdb.org/t/p/w300/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg" }
  ],
  Wednesday: [
    { title:"Obsession", rating:"R16", warn:"", times:["2:30PM","8:10PM"], poster:"https://image.tmdb.org/t/p/w300/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg" },
    { title:"Backrooms", rating:"M", warn:"", times:["2:30PM","7:30PM"], poster:"https://image.tmdb.org/t/p/w300/rhGx6E3qRNMgj3i5su2oukNHwIQ.jpg" },
    { title:"Weapons", rating:"R16", warn:"", times:["6:00PM"], poster:"https://image.tmdb.org/t/p/w300/cpf7vsRZ0MYRQcnLWteD5jK9ymT.jpg" }
  ],
  Thursday: [
    { title:"Obsession", rating:"R16", warn:"", times:["2:30PM","8:10PM"], poster:"https://image.tmdb.org/t/p/w300/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg" }
  ],
  Friday: [
    { title:"Obsession", rating:"R16", warn:"", times:["2:30PM","8:10PM"], poster:"https://image.tmdb.org/t/p/w300/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg" },
    { title:"Backrooms", rating:"M", warn:"", times:["2:30PM","7:30PM"], poster:"https://image.tmdb.org/t/p/w300/rhGx6E3qRNMgj3i5su2oukNHwIQ.jpg" },
    { title:"Toy Story 5", rating:"G", warn:"", times:["8:00PM"], poster:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlIND99f2yirdCpkogEnIdQtBDEJ3klWI6keME9wCv8w&s=10" }
  ],
  Saturday: [
    { title:"Obsession", rating:"R16", warn:"", times:["2:30PM","8:10PM"], poster:"https://image.tmdb.org/t/p/w300/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg" }
  ],
  Sunday: [
    { title:"Obsession", rating:"R16", warn:"", times:["2:30PM","8:10PM"], poster:"https://image.tmdb.org/t/p/w300/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg" },
    { title:"The Life of Big E (Jeffery Epstein)", rating:"2+", warn:"sex scenes", times:["12:00AM","17:38PM"], poster:"" }
  ]
};
/* ===SCHEDULE_END=== */