async function fetchProgress() {
  const res = await fetch('/api/progress');
  const data = await res.json();
  const percent = Math.min(100, (data.raised / data.goal) * 100);
  document.getElementById('progress-bar').style.width = percent + '%';
  document.getElementById('progress-percentage').innerText = percent.toFixed(1) + '%';
  document.getElementById('progress-value').innerText = `$${data.raised.toFixed(2)}`;
  document.getElementById('progress-max').innerText = `$${data.goal}`;
}

async function fetchAlerts() {
  const res = await fetch('/api/alerts');
  const data = await res.json();
  const alertsBox = document.getElementById('alerts-box');
  if (!alertsBox) return;
  alertsBox.innerHTML = '';
  data.forEach(alert => {
    const div = document.createElement('div');
    div.className = 'alert';
    div.innerText = `${alert.payer} donated $${alert.amount}`;
    alertsBox.appendChild(div);
  });
}

setInterval(() => {
  if (document.getElementById('progress-bar')) fetchProgress();
  if (document.getElementById('alerts-box')) fetchAlerts();
}, 3000);
