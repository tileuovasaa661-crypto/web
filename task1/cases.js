// Шаг 3. Кейсы.
// Каждый кейс: номер, вопрос и функция run(),
// которая ОДНОЙ цепочкой jQuery ищет по странице и возвращает найденное.
 
const cases = [
  {
    n: 1,
    q: "Who is in the hall?",
    run: function () { return $("#room-hall .guest"); }
  },
  {
    n: 2,
    q: "Who is dressed in yellow or purple?",
    run: function () { return $(".guest.yellow, .guest.purple"); }
  },
  {
    n: 3,
    q: "Which AITU students are upstairs?",
    run: function () { return $("#floor-2 .guest.aitu"); }
  },
  {
    n: 4,
    q: "Who has glasses or a bag?",
    run: function () { return $(".guest:has(.thing.glasses), .guest:has(.thing.bag)"); }
  },
  {
    n: 5,
    q: "Who came with nothing at all?",
    run: function () { return $(".guest:not(:has(.thing))"); }
  },
  {
    n: 6,
    q: "Who has a phone but no bag?",
    run: function () { return $(".guest.has-phone:not(.has-bag)"); }
  },
  {
    n: 7,
    q: "Who arrived between 20:30 and 21:00, both times included?",
    run: function () { return $(".guest").filter(function () { return $(this).attr("data-time") >= "20:30" && $(this).attr("data-time") <= "21:00"; }); }
  },
  {
    n: 8,
    q: "Who arrived after 21:00 and is not an AITU student?",
    run: function () { return $(".guest:not(.aitu)").filter(function () { return $(this).attr("data-time") > "21:00"; }); }
  },
    {
    n: 9,
    q: "Who stands right next to Askar?",
    run: function () { return $("#guest-askar").prev().add($("#guest-askar").next()); }
  },
  {
    n: 10,
    q: "Who stands last in each room?",
    run: function () { return $(".guests .guest:last-child"); }
  },
  {
    n: 11,
    q: "Who stands third in each room?",
    run: function () { return $(".guests .guest:nth-child(3)"); }
  },
  {
    n: 12,
    q: "Who stands after Timur in his room?",
    run: function () { return $("#guest-timur").nextAll(); }
  },
  {
    n: 13,
    q: "Who stands right before someone in black?",
    run: function () { return $(".guest.black").prev(); }
  },
    {
    n: 14,
    q: "In which room is Aruzhan?",
    run: function () { return $("#guest-aruzhan").closest(".room"); }
  },
  {
    n: 15,
    q: "Which rooms have fewer than 6 guests?",
    run: function () { return $(".room").filter(function () { return $(this).find(".guest").length < 6; }); }
  },
  {
    n: 16,
    q: "In which rooms does somebody have a cup, but nobody wears glasses?",
    run: function () { return $(".room:has(.thing.cup):not(:has(.thing.glasses))"); }
  },
  {
    n: 17,
    q: "Who came first to each room?",
    run: function () { return $(".guest").filter(function () { const t = $(this).attr("data-time"); return $(this).siblings().filter(function () { return $(this).attr("data-time") < t; }).length === 0; }); }
  },
    {
    n: 18,
    q: "Miras (AITU, blue, 21:20, phone) joins Askar and Inkar, standing between them.",
    run: function () { return makeGuest({ name: "Miras", gender: "m", color: "blue", time: "21:20", aitu: true, things: ["phone"] }).hide().insertAfter("#guest-askar").fadeIn(800); }
  },
  {
    n: 19,
    q: "Natasha says goodbye and goes home.",
    run: function () { return $("#guest-natasha").fadeOut(800, function () { $(this).remove(); }); }
  },
  {
    n: 20,
    q: "Who took the cake?",
    run: function () { return $("#floor-1 .guest.has-crumbs:not(.has-cup)").filter(function () { const t = $(this).attr("data-time"); return t > "21:00" && t < "21:30"; }).filter(function () { return $(this).prev().add($(this).next()).is(".aitu"); }); }
  }
];
 
// Создаём кнопки, когда страница загрузилась
$(function () {
  cases.forEach(function (c, i) {
    $("<button>")
      .addClass("case-btn")
      .attr("data-index", i)
      .text(c.n + ". " + c.q)
      .appendTo("#buttons");
  });
 
  // Один обработчик на все кнопки (делегирование событий)
  $("#buttons").on("click", ".case-btn", function () {
    const c = cases[$(this).attr("data-index")];
    $(".case-btn").removeClass("active");
    $(this).addClass("active");
    runCase(c);
  });
});
 
// Выполняет один кейс
function runCase(c) {
  buildHouse();              // перед каждым кейсом строим дом заново
  const $found = c.run();    // цепочка jQuery кейса
 
  // Найденные гости: подсветка + один прыжок
  $found.filter(".guest")
    .addClass("found")
    .animate({ top: "-16px" }, 180)
    .animate({ top: "0px" }, 180);
 
  // Найденные комнаты: подсветка
  $found.filter(".room").addClass("found-room");
 
  // Имена найденных
  const names = $found.map(function () {
    return $(this).attr("data-name");
  }).get();
 
  showResult(c, names);
}
 
// Показывает результат под кнопками
function showResult(c, names) {
  const $result = $("#result").empty();
  $("<div>").addClass("question").text("Case " + c.n + ": " + c.q).appendTo($result);
  $("<div>").addClass("count").text("Found: " + names.length).appendTo($result);
  $("<div>").addClass("names").text(names.length ? names.join(", ") : "nobody").appendTo($result);
  $("<pre>").text(chainText(c.run)).appendTo($result);
}
 
// Достаёт текст цепочки из функции run (для скриншотов в отчёт)
function chainText(fn) {
  const code = fn.toString();
  return code.slice(code.indexOf("return ") + 7, code.lastIndexOf(";"));
}