// Задание 2.2. Карточка гостя.
// Клик по гостю — карточка вырастает из его аватара.
// Esc или клик мимо — карточка уменьшается и уходит обратно в аватар.
 
const CARD_WIDTH = 320;   // ширина открытой карточки
const CARD_TIME  = 350;   // длительность анимации, мс
 
let $openCard = null;     // карточка, которая сейчас открыта (только одна)
 
// Слова для вещей
const thingWords = {
  phone: "a phone",
  glasses: "glasses",
  bag: "a bag",
  cup: "a cup",
  crumbs: "cake crumbs"
};
 
$(function () {
  // Клик по гостю (делегирование: гости перестраиваются, а #house остаётся)
  $("#house").on("click", ".guest", function () {
    const id = $(this).attr("id");
 
    // Клик по тому же гостю — просто закрываем
    if ($openCard && $openCard.attr("data-guest") === id) {
      closeCard();
      return;
    }
 
    closeCard();          // первая карточка закрывается...
    openCard($(this));    // ...и открывается новая
  });
 
  // Esc закрывает карточку
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") closeCard();
  });
 
  // Клик мимо карточки закрывает её
  $(document).on("click", function (e) {
    if ($(e.target).closest(".info-card, .guest").length === 0) {
      closeCard();
    }
  });
});
 
// Открывает карточку гостя
function openCard($guest) {
  const $avatar = $guest.find(".avatar");
  const start = $avatar.offset();          // где аватар на странице
  const size = $avatar.outerWidth();       // размер аватара
 
  const $card = $("<div>")
    .addClass("info-card")
    .attr("data-guest", $guest.attr("id"))
    .append(makeCardContent($guest));
 
  // Узнаём настоящую высоту: ставим полную ширину невидимо и меряем
  $card.css({ width: CARD_WIDTH, visibility: "hidden" }).appendTo("body");
  const height = $card.outerHeight();
 
  // Куда вырасти: в центр видимой части окна
  const end = {
    left: $(window).scrollLeft() + ($(window).width() - CARD_WIDTH) / 2,
    top: $(window).scrollTop() + Math.max(10, ($(window).height() - height) / 2)
  };
 
  // Старт: маленький круг прямо на аватаре
  $card.css({
    left: start.left,
    top: start.top,
    width: size,
    height: size,
    borderRadius: size / 2,
    opacity: 0.4,
    visibility: "visible"
  });
 
  // Растём до полного размера
  $card.animate({
    left: end.left,
    top: end.top,
    width: CARD_WIDTH,
    height: height,
    borderRadius: 16,
    opacity: 1
  }, CARD_TIME);
 
  $openCard = $card;
}
 
// Закрывает открытую карточку: уменьшается обратно в аватар
// done — необязательная функция, которая выполнится после закрытия
function closeCard(done) {
  if (!$openCard) return;
 
  const $card = $openCard;
  $openCard = null;
 
  // Аватар ищем заново по id: дом мог перестроиться
  const $avatar = $("#" + $card.attr("data-guest") + " .avatar");
 
  // Гостя больше нет на странице (например, Наташа ушла) — просто тает
  if ($avatar.length === 0) {
    $card.stop(true).fadeOut(200, function () {
      $(this).remove();
      if (done) done();
    });
    return;
  }
 
  const pos = $avatar.offset();
  const size = $avatar.outerWidth();
 
  $card.stop(true).animate({
    left: pos.left,
    top: pos.top,
    width: size,
    height: size,
    borderRadius: size / 2,
    opacity: 0
  }, CARD_TIME, function () {
    $(this).remove();     // колбэк: после анимации удаляем карточку
    if (done) done();
  });
}
 
// Содержимое карточки: вся информация словами
function makeCardContent($guest) {
  const name = $guest.attr("data-name");
  const color = $guest.attr("data-color");
  const time = $guest.attr("data-time");
  const isAitu = $guest.hasClass("aitu");
  const things = $guest.attr("data-things").split(" ").filter(t => t !== "");
 
  const $room = $guest.closest(".room");
  const roomName = $room.attr("data-name");
  const floor = $room.attr("data-floor");
  const place = $guest.index() + 1;   // место в ряду, считая с 1
 
  const $inner = $("<div>").addClass("info-inner").css("width", CARD_WIDTH);
 
  // Шапка: аватар и имя
  const $head = $("<div>").addClass("info-head " + color).appendTo($inner);
  $("<div>").addClass("avatar").append($guest.find("img").clone()).appendTo($head);
  $("<h3>").text(name).appendTo($head);
 
  // Информация словами
  const $list = $("<ul>").addClass("info-list").appendTo($inner);
  $("<li>").text("🕒 Came at " + time).appendTo($list);
  $("<li>").text(isAitu ? "🎓 AITU student" : "🎓 Not an AITU student").appendTo($list);
  $("<li>").text("👕 Wears " + color).appendTo($list);
  $("<li>").text(things.length ? "🎒 Has " + listWords(things) : "🎒 Came with nothing").appendTo($list);
  $("<li>").text("📍 In the " + roomName + ", floor " + floor + ", " + ordinal(place) + " from the left").appendTo($list);
 
  // Задание 2.3: кнопка для каждой другой комнаты
  const $moves = $("<div>").addClass("moves").appendTo($inner);
  $(".room").not($room).each(function () {
    $("<button>")
      .addClass("move-btn")
      .attr("data-room", $(this).attr("id").replace("room-", ""))
      .text("Move to the " + $(this).attr("data-name").toLowerCase())
      .appendTo($moves);
  });
 
  return $inner;
}
 
// ["phone","bag","cup"] → "a phone, a bag and a cup"
function listWords(things) {
  const words = things.map(t => thingWords[t]);
  if (words.length === 1) return words[0];
  return words.slice(0, -1).join(", ") + " and " + words[words.length - 1];
}
 
// 1 → "1st", 2 → "2nd", 3 → "3rd", 4 → "4th"
function ordinal(n) {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return n + "th";
}