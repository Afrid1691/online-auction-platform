// Live countdowns on listing and detail pages: turns each "Ends <date>"
// label into a ticking "2h 14m left" style timer so bidders can see at a
// glance how much time is left in an auction.
(function () {
  var nodes = document.querySelectorAll('[data-ends-at]');
  if (!nodes.length) return;

  function format(ms) {
    if (ms <= 0) return 'Auction ended';
    var totalSeconds = Math.floor(ms / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;
    if (days > 0) return days + 'd ' + hours + 'h left';
    if (hours > 0) return hours + 'h ' + minutes + 'm left';
    if (minutes > 0) return minutes + 'm ' + seconds + 's left';
    return seconds + 's left';
  }

  function tick() {
    var now = Date.now();
    nodes.forEach(function (node) {
      var endsAt = new Date(node.getAttribute('data-ends-at')).getTime();
      node.textContent = format(endsAt - now);
    });
  }

  tick();
  setInterval(tick, 1000);
})();
