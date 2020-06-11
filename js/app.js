// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
	const modelURL = "model.json";
	const metadataURL = "metadata.json";
	
	document.querySelector('#start-btn').innerHTML = 'Starting App....';
	document.querySelector('#start-btn').disabled = true;

	// load the model and metadata
	// Refer to tmImage.loadFromFiles() in the API to support files from a file picker
	// or files from your local hard drive
	// Note: the pose library adds "tmImage" object to your window (window.tmImage)
	model = await tmImage.load(modelURL, metadataURL);
	maxPredictions = model.getTotalClasses();

	// Convenience function to setup a webcam
	const flip = false; // whether to flip the webcam
	webcam = new tmImage.Webcam(300, 300, flip); // width, height, flip
	await webcam.setup(); // request access to the webcam
	await webcam.play();
	window.requestAnimationFrame(loop);
	document.querySelector('#start-btn').style.display = 'none';

	// append elements to the DOM
	document.getElementById("webcam-container").appendChild(webcam.canvas);
	labelContainer = document.getElementById("label-container");
	for (let i = 0; i < maxPredictions; i++) { // and class labels
		//labelContainer.appendChild(document.createElement("div"));
		const childContainer = document.createElement('div');
		
		const childLabel = document.createElement('div');
		childLabel.setAttribute('id', 'child-label-'+i);
		childLabel.setAttribute('class', 'child-label');
		const childValue = document.createElement('div');
		childValue.setAttribute('id', 'child-value-'+i);
		childValue.setAttribute('class', 'child-value');
		
		const progressBarContainer = document.createElement('div');
		progressBarContainer.setAttribute('id', 'progress-bar-'+i);
		progressBarContainer.setAttribute('class', 'progress-bar');
		progressBarContainer.appendChild(document.createElement('div'));
		childValue.appendChild(progressBarContainer);
		
		childContainer.appendChild(childLabel);
		childContainer.appendChild(childValue);
		childContainer.setAttribute('class', 'child-container');
		
		labelContainer.appendChild(childContainer);
		labelContainer.style.display = 'flex';
	}
}

async function loop() {
	webcam.update(); // update the webcam frame
	await predict();
	window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
	// predict can take in an image, video or canvas html element
	const prediction = await model.predict(webcam.canvas);
	const classNames = ['Indomie', 'Mie Sedaap', 'Bakmi Mewah', 'Sarimi', 'Pop Mie'];
	for (let i = 0; i < maxPredictions; i++) {
		//const classPrediction = classNames[i] + ": " + prediction[i].probability.toFixed(2);
		//labelContainer.appendChild(childContainer
		
		const predictResult = prediction[i].probability.toFixed(2) * 100;
		
		document.querySelector('#child-label-'+i).innerHTML = classNames[i];
		document.querySelector('#progress-bar-'+i+' > div').style.width = predictResult+'%';
	}
}