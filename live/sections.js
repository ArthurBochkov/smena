/* Разделы кабинета: след «откуда вы пришли» и привязка к проекту.
   Параметры адреса:
     p=shop        — раздел открыт в проекте «Лавка» (иначе «Онлайн-школа»)
     from=<ключ>   — что именно привело сюда, текст берётся из TRACE
     q=<текст>     — если привёл запрос из ленты, показываем его дословно      */
(function () {
  var qs = new URLSearchParams(location.search);
  var shop = qs.get('p') === 'shop';
  var from = qs.get('from') || '';
  var typed = qs.get('q') || '';
  var back = shop ? 'shop.html' : 'screen.html';
  var suffix = shop ? '?p=shop' : '';

  var TRACE = {
    'tasks-100':    'сюда вас привела карточка «Разобрал 100 просроченных задач» от 14:06',
    'tasks-hidden': 'сюда вас привела карточка «Разобрал 100 просроченных задач» — вы открыли то, что он снял',
    'dialogs-wake': 'сюда вас привела карточка «Написал девятерым, кто молчал две недели» от 11:20',
    'dialogs-night':'сюда вас привела карточка «Ночью было четырнадцать обращений» от 09:15',
    'dialogs-nds':  'сюда вас привела задача «Не передаётся НДС 7%» из раздела «Задачи»',
    'dialogs-carts':'сюда вас привела карточка «Считаю доставку шестерым вручную»',
    'orders-14':    'сюда вас привела карточка «Собрал и отправил 14 заказов» от 13:35',
    'orders-addr':  'сюда вас привела плитка «Заказы» — двое не подтвердили пункт выдачи',
    'orders-late':  'сюда вас привела карточка «Три доставки опаздывают на сутки» от 11:50',
    'pay':          'сюда вас привела карточка «Разобрал выручку смены»',
    'pay-stuck':    'сюда вас привела строка «две оплаты зависли на эквайринге»',
    'sbp':          'сюда вас привела плитка «Деньги» — три оплаты по СБП не долетели до заказов',
    'rail':         'вы пришли из меню — фильтр Сейл всё равно поставил, как для себя'
  };

  var FILTER = {
    'tasks-100':    'живые, просрочено',
    'tasks-hidden': 'снятые, с причиной',
    'dialogs-wake': 'вернулись за 24 часа',
    'dialogs-night':'ночь, все закрыты',
    'dialogs-nds':  'этот клиент, вся переписка',
    'dialogs-carts':'ответили после расчёта доставки',
    'orders-14':    'собраны за смену',
    'orders-addr':  'ждут подтверждения адреса',
    'orders-late':  'доставка просрочена',
    'pay':          'оплаты за смену',
    'pay-stuck':    'зависшие на эквайринге',
    'sbp':          'СБП, сведённые вручную'
  };

  // 1. текст следа
  var el = document.querySelector('[data-trace]');
  if (el) {
    var t = TRACE[from];
    if (!t && from === 'ask' && typed) t = 'сюда вас привёл запрос «' + typed + '» из ленты';
    el.textContent = t || el.getAttribute('data-trace') || '';
  }

  // 2. какой фильтр поставил Сейл
  var f = document.querySelector('[data-filter]');
  if (f && FILTER[from]) f.textContent = FILTER[from];

  // 3. возврат — в тот проект, из которого пришли
  document.querySelectorAll('[data-back]').forEach(function (a) {
    a.setAttribute('href', back);
    if (a.dataset.back === 'label') a.textContent = shop ? '← Вернуться в смену «Лавки»' : '← Вернуться в смену';
  });

  // 4. рельс и внутренние переходы — в рамках того же проекта
  document.querySelectorAll('[data-nav]').forEach(function (a) {
    var target = a.dataset.nav;
    if (target === 'shift') { a.setAttribute('href', back); return; }
    a.setAttribute('href', target + suffix + (suffix ? '&' : '?') + 'from=rail');
  });

  // 5. содержимое под проект: показываем только своё
  document.querySelectorAll('[data-p]').forEach(function (n) {
    var mine = n.dataset.p === (shop ? 'shop' : 'school');
    if (!mine) n.remove();
  });

  // 6. подпись проекта в шапке
  var pj = document.querySelector('[data-project]');
  if (pj) pj.textContent = shop ? 'Лавка' : 'Онлайн-школа';
  document.title = document.title.replace('Онлайн-школа', shop ? 'Лавка' : 'Онлайн-школа');
})();
