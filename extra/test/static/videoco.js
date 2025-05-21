document.getElementById('createRoomBtn').onclick = async function() {
    const res = await fetch('/create-room', { method: 'POST' });
    const data = await res.json();
    const url = data.url;
    const callFrame = window.DailyIframe.createFrame(document.getElementById('videoContainer'), {
        showLeaveButton: true,
        iframeStyle: {
            width: '100%',
            height: '500px',
            border: '0',
            borderRadius: '20px',
            boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)'
        }
    });
    callFrame.join({ url });
};

document.getElementById('join-call-btn').onclick = function() {
    window.location.href = "/join-call"; // ou la route de ta page d'appel
};