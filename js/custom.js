function startApp()
{
	navigator.getMedia = ( navigator.getUserMedia || // use the proper vendor prefix
					   navigator.webkitGetUserMedia ||
					   navigator.mozGetUserMedia ||
					   navigator.msGetUserMedia);

	navigator.getMedia({video: true}, function() {
		navigator.permissions.query({name:'camera'}).then(function(result) {
			console.log(result.state);
			if (result.state === 'granted') {
				init();
			} else if (result.state === 'prompt') {
				window.location.reload();
			} else if (result.state === 'denied') {
			   alert('we need camera access!');
			   document.querySelector('#start-btn').disabled = true;
			   document.querySelector('#start-btn').innerHTML = 'Failed';
			   document.querySelector('#start-btn').style.backgroundColor = 'red';
			}
		});
	}, function() {
	  alert('webcam not found! Please make sure webcam is accessible before try to run this webapp!');
	  document.querySelector('#start-btn').disabled = true;
	  document.querySelector('#start-btn').innerHTML = 'Failed';
	  document.querySelector('#start-btn').style.backgroundColor = 'red';
	});
}