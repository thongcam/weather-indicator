const result = {};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function preload(arrayOfImages) {
  $(arrayOfImages).each(function () {
    $("<img/>")[0].src = this;
    // Alternatively you could use:
    // (new Image()).src = this;
  });
}

let possibleInterfaces = [
  [
    {
      id: "1_1",
      path: "interface1_1.jpg",
    },
    {
      id: "1_2",
      path: "interface1_2.jpg",
    },
    {
      id: "1_3",
      path: "interface1_3.jpg",
    },
  ],
  [
    {
      id: "2_1",
      path: "interface2_1.jpg",
    },
    {
      id: "2_2",
      path: "interface2_2.jpg",
    },
    {
      id: "2_3",
      path: "interface2_3.jpg",
    },
  ],
];

let interfacesList = [];

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let currentProxyID = 1;
let currentRealID = 0;
let stage = "image"; //input
let tutorial = true;
let tutorialStage = "intro"; // image / input

const backSetup = () => {
  $("#back").click(() => {
    console.log("back");
    if (tutorialStage === "image") {
      $("#content").empty();
      $("#content").append(`
          <h2 class="ui header blue left aligned" id="content-header">Thank you for doing this test!</h2>
          <div class="ui visible large message" id="tutorial">
              <p class="ui content gray" id="tutorial-message">In this test you will be presented several different interfaces which will display some weather data. Each interface will be shown for 3 seconds. After that, you will be asked to write down all the information you acquired from the interface.</p>
          </div>
          <br>
          <div class="ui container">
              <button class="ui primary button right floated aligned" id="start-tutorial">Start tutorial!</button>
          </div>
          <br><br><br>
          <div class="ui warning message" id="reload-warning">
          <div class="header">
              Please do not reload the webpage during the test!
          </div>
          </div>
          `);
      tutorialStage = "intro";
      startTutorialSetup();
    } else if (tutorialStage === "input") {
      $("#input, #done, #start-test, #back, #content br").remove();
      $("#content-header").text("Interface 0 (example)");
      $("#tutorial-message").text(
        `When you are ready, click the "Show interface" button. After clicking, an interface will appear. It will disappear after 3 seconds.`
      );
      $("#content").append(`
    <button class= "ui primary button center aligned" id="show">Show interface</button>
    <h3 id="counter" class="ui header">Click the button to show interface and start timer.</h3>
    <div class="ui fluid placeholder" id="image-placeholder">
      <div class="image"></div>
    </div>
    <br>
    <button class= "ui primary button right floated aligned" id="to-input" disabled>What did you see?</button>
    <button class="ui hollowed button right floated aligned" id="back" disabled>Back</button>
    `);
      tutorialStage = "image";
      backSetup();
      toInputSetup();
      showSetup();
    }
  });
};

const startTutorialSetup = () => {
  $("#start-tutorial").click(() => {
    $("#reload-warning").remove();
    $("#content br").remove();
    $("#start-tutorial").remove();
    $("#content-header").text("Interface 0 (example)");
    $("#tutorial-message").text(
      `When you are ready, click the "Show interface" button. After clicking, an interface will appear. It will disappear after 3 seconds.`
    );
    $("#content").append(`
    <button class= "ui primary button center aligned" id="show">Show interface</button>
    <h3 id="counter" class="ui header">Click the button to show interface and start timer.</h3>
    <div class="ui fluid placeholder" id="image-placeholder">
      <div class="image"></div>
    </div>
    <br>
    <button class= "ui primary button right floated aligned" id="to-input" disabled>What did you see?</button>
    <button class="ui hollowed button right floated aligned" id="back" disabled>Back</button>
    `);
    tutorialStage = "image";
    backSetup();
    toInputSetup();
    showSetup();
  });
};

const showSetup = () => {
  $("#show").click(() => {
    $("#show").prop("disabled", true);
    $("#image-placeholder").remove();
    $("#counter").text(`The interface will disappear in: 3 seconds`);
    if (tutorial) {
      $(`<img src="./image/sample.jpg" alt="" class="ui image big fluid centered" id="main-image"></img>
          <br>`).insertAfter("#counter");
    } else {
      $(
        `<img src="./image/${
          interfacesList[currentProxyID - 1].path
        }" alt="" class="ui image big fluid centered" id="main-image"></img>`
      ).insertAfter("#counter");
    }
    $("#main-image").on("load", () => {
      runTimer(3);
    });
  });
};

const toInputSetup = () => {
  $("#to-input").click(() => {
    $("#to-input, #show, #back, #counter").remove();
    if (tutorial) {
      $("#tutorial-message").text(
        "You can type in the text field what you see. After you are done, click the done button. You won't be able to change your input. Don't worry that you are wrong - the interfaces are being tested, not you!"
      );
    }
    $("#content").append(`
    <br>
    <div class="ui form">
    <div class="field" id="input">
        <label class="left aligned">What did you see?</label>
        <textarea name="" id="input-field" cols="30" rows="2" placeholder="Type something..."></textarea>
    </div>
    </div>
    <button class="ui button toggle left floated" style="margin-top: 5px;" id="done">Done</button>
    <br><br><br>
    
    `);
    if (tutorial) {
      $("#content").append(`
      <button class="ui button toggle right floated green" id="start-test" disabled>Do the test!</button>
      <button class="ui hollowed button right floated aligned" id="back">Back</button>`);
      startTestSetup();
      backSetup();
      tutorialStage = "input";
    } else if (currentProxyID < interfacesList.length) {
      $("#content").append(`
      <button class="ui button toggle right floated green" id="next-interface" disabled>Next interface</button>`);
      nextInterfaceSetup();
    } else {
      $("#content").append(`
      <button class="ui button toggle right floated green" id="finish-test" disabled>Finish test</button>
      `);
      finishTestSetup();
    }
    doneSetup();
  });
};

const doneSetup = () => {
  $("#done").click(() => {
    if (!tutorial) {
      $("#next-interface").prop("disabled", false);
      $("#finish-test").prop("disabled", false);
      result["interface" + currentRealID] = $("#input-field").val();
    } else {
      $("#start-test").prop("disabled", false);
    }
    $("#input-field").prop("disabled", true);
  });
};

const startTestSetup = () => {
  $("#start-test").click(() => {
    tutorial = false;
    stage = "image";
    currentProxyID = 1;
    currentRealID = interfacesList[currentProxyID - 1].id;
    $("#input, #done, #start-test, #back, #content br, #tutorial").remove();
    $("#content-header").text(
      `Interface ${currentProxyID}/${interfacesList.length}`
    );
    $("#content").append(`
    <button class= "ui primary button center aligned" id="show">Show interface</button>
    <h3 id="counter" class="ui header">Click the button to show interface and start timer.</h3>
    <div class="ui fluid placeholder" id="image-placeholder">
      <div class="image"></div>
    </div>
    <br>
    <button class= "ui primary button right floated aligned" id="to-input" disabled>What did you see?</button>
    `);
    toInputSetup();
    showSetup();
  });
};

const nextInterfaceSetup = () => {
  $("#next-interface").click(() => {
    stage = "image";
    currentProxyID += 1;
    currentRealID = interfacesList[currentProxyID - 1].id;
    $("#input, #done, #next-interface, #back, #content br").remove();
    $("#content-header").text(
      `Interface ${currentProxyID}/${interfacesList.length}`
    );
    $("#content").append(`
    <button class= "ui primary button center aligned" id="show">Show interface</button>
    <h3 id="counter" class="ui header">Click the button to show interface and start timer.</h3>
    <div class="ui fluid placeholder" id="image-placeholder">
      <div class="image"></div>
    </div>
    <br>
    <button class= "ui primary button right floated aligned" id="to-input" disabled>What did you see?</button>
    `);
    toInputSetup();
    showSetup();
  });
};

const finishTestSetup = () => {
  $("#finish-test").click(() => {
    $("#content").empty();
    $("#content").append(`
    <h1 class="ui header blue left aligned">What interface do you prefer?</h1>
    `);
    $("#main").append(`
    <div class="ui form" id="radio">
            <div style="display: flex; justify-content: center; flex-direction: row; flex-wrap: wrap;" class="fields">
                <label style="display: none;">How often do you use checkboxes?</label>
                <div class="field" style="text-align: center;">
                    <img src="./image/interface1 blank.png" class="ui image large centered" style="margin:0 50px;" alt="" srcset="">
                    <div class="ui radio checkbox" id="interface2">
                        <input type="radio" name="interface" tabindex="0" data-interface="interface1">
                        <label>Interface 1</label>
                    </div>
                </div>
                <div class="field" style="text-align: center;">
                    <img src="./image/interface2 blank.png" class="ui image large centered" style="margin:0 50px;" alt="">
                    <div class="ui radio checkbox"  id="interface1">
                        <input type="radio" name="interface" tabindex="0" data-interface="interface2">
                        <label>Interface 2</label>
                    </div>
                </div>
            </div>
        </div>
        <button class="ui button toggle right floated green" id="end-test" disabled>End test</button>
    `);
    radioSetup();
    endTestSetup();
  });
};

const endTestSetup = () => {
  $("#end-test").click(() => {
    console.log(result);
    $("#content").empty();
    $("#radio, #end-test").remove();
    $("#content").append(`
  <br><br><br><br><br><br>
            <h2 class="ui header blue center"> Thank you so much for doing this test! 🎉</h2>
            <h3>Your contribution will help us build a better product!</h3>
  `);
    fetch(
      "https://weather-indicator-interface.ew.r.appspot.com/send-response",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      }
    ).then((res) => {
      console.log(res);
    });
  });
};

const radioSetup = () => {
  $(".ui.radio.checkbox input").change((event) => {
    console.log(event.target);
    if (event.target.checked) {
      $("#end-test").prop("disabled", false);
      result["preference"] = $(event.target).data("interface");
      console.log(result);
    }
  });
};

$(document).ready(() => {
  startTutorialSetup();
  interfacesList.push(possibleInterfaces[0][getRandomInt(0, 2)]);
  interfacesList.push(possibleInterfaces[1][getRandomInt(0, 2)]);
  shuffle(interfacesList);
  preload(["./image/sample.jpg"]);
  preload(interfacesList.map((a) => "./image/" + a.path));
});

const runTimer = (limit) => {
  let time = 1;
  const id = setInterval(() => {
    frame(limit, 1);
  }, 1000);
  const frame = (limit, step) => {
    let remaining = limit - time;
    if (time <= limit) {
      $("#counter").text(
        `The interface will disappear in: ${remaining} seconds`
      );
      time += step;
    } else {
      $("#main-image").remove();
      $("#content button").prop("disabled", false);
      $("#show").prop("disabled", true);
      clearInterval(id);
    }
  };
};
