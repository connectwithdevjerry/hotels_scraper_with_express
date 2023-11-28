// scraper functions are found here
const { getAllHotels } = require("./api");
const { Builder, Browser, Keys, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

// please note that the user of this code needs to have chrome webdriver installed on the his computer. After installation, also ensure the webdriver is set to path. How to install the webdriver? use this link https://chromedriver.storage.googleapis.com/index.html

const setDate = (today, type = null) => {
  let yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();
  let sugar_date = `${dd}-${mm}-${yyyy}`;
  let gracebay_date = `${yyyy}-${mm}-${dd}`;
  if (type == "gracebay") {
    return gracebay_date;
  } else {
    return sugar_date;
  }
};

const sugar_beach = async () => {
  let options = new chrome.Options();
  let drivers = await new Builder().forBrowser(Browser.CHROME).build();
  //   .setChromeOptions(options.headless())
  let date = new Date();
  let todays_date = setDate(date);
  date.setDate(date.getDate() + 1);
  let tomorrow = setDate(date);

  await drivers.manage().window().maximize();

  let website_url = `https://reservations.viceroyhotelsandresorts.com/?_ga=2.63980905.754880256.1697504574-1226995346.1697504574&adult=1&arrive=${todays_date}&chain=1003&child=1&childages=17&currency=USD&depart=${tomorrow}&hotel=22215&level=hotel&locale=en-US&rooms=1`;

  console.log({
    todays_date,
    tomorrow,
  });

  drivers.manage().setTimeouts({ implicit: 6000 });

  await drivers.get(website_url);
  let hotelName = await drivers
    .findElement(By.id("heroTitle"))
    .getText()
    .then((value) => value);

  console.log(hotelName);
  try {
    let check_avail = await drivers
      .findElement(
        By.xpath(
          "//div[@class='message_text']//h2[contains(@class, 'app_heading2 message_heading')]//span"
        )
      )
      .getText()
      .then((value) => value);

    console.log({ check_avail });
  } catch (error) {
    console.error("Element Exists: if not, kindly log out the error");
  }

  let button = await drivers.findElement(
    By.xpath(
      "//div[@class='select_container select_hasValue']//button[@class='select_hiddenInput']"
    )
  );
  await button.click();

  let lis = await drivers.findElement(
    By.xpath("//ul[@class='select_dropdown']//li")
  );
  await lis.click();

  drivers.manage().setTimeouts({ implicit: 6000 });

  let itr = await drivers.findElements(
    By.xpath(
      "//div[@class='app_row']//div[contains(@class, 'app_col-md-12 app_col-lg-12')]"
    )
  );
  for (i = 0; i < itr.length; i++) {
    try {
      let room_divs = await drivers.findElements(
        By.xpath(
          "//div[@class='app_row']//div[contains(@class, 'app_col-md-12 app_col-lg-12')]"
        )
      );
      let room_name = await room_divs[i]
        .findElement(By.css("h2"))
        .getText()
        .then((value) => value);
      let roomsize_guests = await room_divs[i]
        .findElement(
          By.xpath(
            "//div[@class='guests-and-roomsize_item guests-and-roomsize_guests']/span"
          )
        )
        .getText()
        .then((value) => value);
      let roomsize_bed = await room_divs[i]
        .findElement(
          By.xpath(
            "//div[@class='guests-and-roomsize_item guests-and-roomsize_bed']/span"
          )
        )
        .getText()
        .then((value) => value);
      let roomsize_area = await room_divs[i]
        .findElement(By.xpath("//div[@class='thumb-cards_price']/span"))
        .getText()
        .then((value) => value);
      // let roomsize_size = await room_divs[i]
      //   .findElement(
      //     By.xpath(
      //       "//div[@class='guests-and-roomsize_item guests-and-roomsize_size']"
      //     )
      //   )
      //   .getText()
      //   .then((value) => value.replace("\nsquare feet", ""));
      let roomsize_size = await room_divs[i]
        .findElement(
          By.className("guests-and-roomsize_item guests-and-roomsize_size")
        )
        .getText()
        .then((value) => value.replace("\nsquare feet", ""));
      let price = await room_divs[i]
        .findElement(By.className("thumb-cards_price"))
        .getText()
        .then((value) => value);
      // let other_info = room_divs[i].findElements(By.TAG_NAME, "li")
      console.log({
        room_name,
        roomsize_area,
        roomsize_bed,
        roomsize_guests,
        roomsize_size,
        price,
      });
    } catch (error) {
      // if i<1 then i=0 implying that there is an error on the webpage we're scraping. Likely to be that the element is not found: NoSuchElement Error
      i < 1 ? console.error(error) : "";
    }
  }

  await drivers.quit();
};

const grace_bay_club = async () => {
  let options = new chrome.Options();
  let drivers = await new Builder().forBrowser(Browser.CHROME).build();
  //   .setChromeOptions(options.headless())
  let date = new Date();
  let todays_date = setDate(date, "gracebay");
  date.setDate(date.getDate() + 1);
  let tomorrow = setDate(date, "gracebay");

  await drivers.manage().window().maximize();

  let website_url = `https://be.synxis.com/?_ga-ft=1bNOi3.0.0.0.0.3ZPUE9-5h0-4io-BlJ-Akmnwggi.0.1&_gl=1*1bmc59b*_ga*MjA5OTcxNjkxOC4xNzAwNjI0MzA5*_ga_FDTY66CS39*MTcwMDYyODk2Mi4yLjEuMTcwMDYyOTI0Ny42MC4wLjA.&adult=1&arrive=${todays_date}&chain=24447&child=0&config=leading1&currency=USD&depart=${tomorrow}&hotel=6905&level=hotel&locale=en-US&roomcategory=JR%2C1BR%2C2BR%2C3BR%2C4BR%2C5BR&rooms=1&src=30&theme=leading1`;

  console.log({
    todays_date,
    tomorrow,
  });

  drivers.manage().setTimeouts({ implicit: 6000 });

  await drivers.get(website_url);
  let hotelName = await drivers
    .findElement(By.id("heroTitle"))
    .getText()
    .then((value) => value);

  console.log(hotelName);
  try {
    let check_avail = await drivers
      .findElement(
        By.xpath(
          "//div[@class='message_text']//h2[contains(@class, 'app_heading2 message_heading')]//span"
        )
      )
      .getText()
      .then((value) => value);

    console.log({ check_avail });
  } catch (error) {
    console.error("Element Exists: if not, kindly log out the error");
  }

  let button = await drivers.findElement(
    By.xpath(
      "//div[@class='select_container select_hasValue']//button[@class='select_hiddenInput']"
    )
  );
  await button.click();

  let lis = await drivers.findElement(
    By.xpath("//ul[@class='select_dropdown']//li")
  );
  await lis.click();

  drivers.manage().setTimeouts({ implicit: 6000 });

  let itr = await drivers.findElements(
    By.xpath(
      "//div[@class='app_row']//div[contains(@class, 'app_col-md-12 app_col-lg-12')]"
    )
  );
  for (i = 0; i < itr.length; i++) {
    try {
      let room_divs = await drivers.findElements(
        By.xpath(
          "//div[@class='app_row']//div[contains(@class, 'app_col-md-12 app_col-lg-12')]"
        )
      );
      let room_name = await room_divs[i]
        .findElement(By.css("h2"))
        .getText()
        .then((value) => value);
      let roomsize_guests = await room_divs[i]
        .findElement(
          By.xpath(
            "//div[@class='guests-and-roomsize_item guests-and-roomsize_guests']/span"
          )
        )
        .getText()
        .then((value) => value);
      let roomsize_bed = await room_divs[i]
        .findElement(
          By.xpath(
            "//div[@class='guests-and-roomsize_item guests-and-roomsize_bed']/span"
          )
        )
        .getText()
        .then((value) => value);
      let roomsize_area = await room_divs[i]
        .findElement(By.xpath("//div[@class='thumb-cards_price']/span"))
        .getText()
        .then((value) => value);
      let roomsize_size = await room_divs[i]
        .findElement(
          By.className("guests-and-roomsize_item guests-and-roomsize_size")
        )
        .getText()
        .then((value) => value.replace("\nsquare feet", ""));
      let price = await room_divs[i]
        .findElement(By.className("thumb-cards_price"))
        .getText()
        .then((value) => value);
      // let other_info = room_divs[i].findElements(By.TAG_NAME, "li")
      let beachEscapes = await room_divs[i]
        .findElement(
          By.xpath(
            ".//div[contains(@class, 'thumb-cards_price')]//div//div[contains(@class, 'thumb-cards_price')]//span"
          )
        )
        .getText()
        .then((value) => value);
      // let beachEscapes = await room_divs[i]
      //   .findElement(
      //     By.xpath(
      //       "//section//div[contains(@class, 'thumb-cards_cardSplit thumb-cards_byRoom')]//div//div[contains(@class, 'app_col-sm-12 app_col-md-8 app_col-lg-8')]//div[contains(@class, 'thumb-cards_rate thumb-cards_show')]//div//div//div[contains(@class, 'thumb-cards_right')]//div//div//div//span"
      //     )
      //   )
      //   .getText()
      //   .then((value) => value);
      let standard = await room_divs[i]
        .findElement(
          By.xpath(
            ".//div[contains(@id, 'auto-child-card-')]//div//div//div[contains(@class, 'thumb-cards_right')]//div//div//div[contains(@class, 'thumb-cards_price')]//span"
          )
        )
        .getText()
        .then((value) => value);
      console.log({
        room_name,
        roomsize_area,
        roomsize_bed,
        roomsize_guests,
        roomsize_size,
        price,
        rates: {
          beachEscapes,
          standard,
        },
      });
    } catch (error) {
      // if i<1 then i=0 implying that there is an error on the webpage we're scraping. Likely to be that the element is not found: NoSuchElement Error
      i < 1 ? console.error(error) : "";
    }
  }

  await drivers.quit();
};

const nizuc = async () => {
  let options = new chrome.Options();
  let drivers = await new Builder().forBrowser(Browser.CHROME).build();
  //   .setChromeOptions(options.headless())
  let date = new Date();
  let todays_date = setDate(date, "gracebay");
  date.setDate(date.getDate() + 1);
  let tomorrow = setDate(date, "gracebay");

  await drivers.manage().window().maximize();

  let website_url = `https://be.synxis.com/?adult=2&arrive=${todays_date}&chain=10237&child=0&currency=USD&depart=${tomorrow}&hotel=58283&level=hotel&locale=en-US&rooms=1`;

  console.log({
    todays_date,
    tomorrow,
  });

  drivers.manage().setTimeouts({ implicit: 6000 });

  await drivers.get(website_url);
  let hotelName = await drivers
    .findElement(By.id("heroTitle"))
    .getText()
    .then((value) => value);

  console.log(hotelName);
  try {
    let check_avail = await drivers
      .findElement(
        By.xpath(
          "//div[@class='message_text']//h2[contains(@class, 'app_heading2 message_heading')]//span"
        )
      )
      .getText()
      .then((value) => value);

    console.log({ check_avail });
  } catch (error) {
    console.error("Element Exists: if not, kindly log out the error");
  }

  let button = await drivers.findElement(
    By.xpath(
      "//div[@class='select_container select_hasValue']//button[@class='select_hiddenInput']"
    )
  );
  await button.click();

  let lis = await drivers.findElement(
    By.xpath("//ul[@class='select_dropdown']//li")
  );
  await lis.click();

  drivers.manage().setTimeouts({ implicit: 6000 });

  let itr = await drivers.findElements(
    By.xpath(
      "//div[@class='app_row']//div[contains(@class, 'app_col-md-12 app_col-lg-12')]"
    )
  );

  for (i = 0; i < itr.length; i++) {
    try {
      let room_divs = await drivers.findElements(
        By.xpath(
          "//div[@class='app_row']//div[contains(@class, 'app_col-md-12 app_col-lg-12')]"
        )
      );
      let room_name = await room_divs[i]
        .findElement(By.css("h2"))
        .getText()
        .then((value) => value);

      let roomsize_guests = await room_divs[i]
        .findElement(
          By.xpath(
            "//div[@class='guests-and-roomsize_item guests-and-roomsize_guests']/span"
          )
        )
        .getText()
        .then((value) => value);

      let roomsize_bed = await room_divs[i]
        .findElement(
          By.xpath(
            "//div[@class='guests-and-roomsize_item guests-and-roomsize_bed']/span"
          )
        )
        .getText()
        .then((value) => value);
      let roomsize_area = await room_divs[i]
        .findElement(By.xpath("//div[@class='thumb-cards_price']/span"))
        .getText()
        .then((value) => value);
      let roomsize_size = await room_divs[i]
        .findElement(
          By.className("guests-and-roomsize_item guests-and-roomsize_size")
        )
        .getText()
        .then((value) => value.replace("\nsquare feet", ""));
      let price = await room_divs[i]
        .findElement(By.className("thumb-cards_price"))
        .getText()
        .then((value) => value);
      // let other_info = room_divs[i].findElements(By.TAG_NAME, "li")
      console.log({
        room_name,
        roomsize_area,
        roomsize_bed,
        roomsize_guests,
        roomsize_size,
        price,
      });
    } catch (error) {
      // if i<1 then i=0 implying that there is an error on the webpage we're scraping. Likely to be that the element is not found: NoSuchElement Error
      i < 1 ? console.error(error) : "";
    }
  }

  await drivers.quit();
};

const wymara_resort = async () => {
  let options = new chrome.Options();
  let drivers = await new Builder().forBrowser(Browser.CHROME).build();
  //   .setChromeOptions(options.headless())
  let date = new Date();
  let todays_date = setDate(date, "gracebay");
  date.setDate(date.getDate() + 1);
  let tomorrow = setDate(date, "gracebay");

  await drivers.manage().window().maximize();

  let website_url = `https://be.synxis.com/?chain=24447&hotel=35896&arrive=${todays_date}&depart=${tomorrow}`;

  console.log({
    todays_date,
    tomorrow,
  });

  drivers.manage().setTimeouts({ implicit: 6000 });

  await drivers.get(website_url);
  let hotelName = await drivers
    .findElement(By.id("heroTitle"))
    .getText()
    .then((value) => value);

  console.log(hotelName);
  try {
    let check_avail = await drivers
      .findElement(
        By.xpath(
          "//div[@class='message_text']//h2[contains(@class, 'app_heading2 message_heading')]//span"
        )
      )
      .getText()
      .then((value) => value);

    console.log({ check_avail });
  } catch (error) {
    console.error("Element Exists: if not, kindly log out the error");
  }

  let button = await drivers.findElement(
    By.xpath(
      "//div[@class='select_container select_hasValue']//button[@class='select_hiddenInput']"
    )
  );
  await button.click();

  let lis = await drivers.findElement(
    By.xpath("//ul[@class='select_dropdown']//li")
  );
  await lis.click();

  drivers.manage().setTimeouts({ implicit: 6000 });

  let itr = await drivers.findElements(
    By.xpath(
      "//div[@class='app_row']//div[contains(@class, 'app_col-md-12 app_col-lg-12')]"
    )
  );
  for (i = 0; i < itr.length; i++) {
    try {
      let room_divs = await drivers.findElements(
        By.xpath(
          "//div[@class='app_row']//div[contains(@class, 'app_col-md-12 app_col-lg-12')]"
        )
      );
      let room_name = await room_divs[i]
        .findElement(By.css("h2"))
        .getText()
        .then((value) => value);
      let roomsize_guests = await room_divs[i]
        .findElement(
          By.xpath(
            "//div[@class='guests-and-roomsize_item guests-and-roomsize_guests']/span"
          )
        )
        .getText()
        .then((value) => value);
      let roomsize_bed = await room_divs[i]
        .findElement(
          By.xpath(
            "//div[@class='guests-and-roomsize_item guests-and-roomsize_bed']/span"
          )
        )
        .getText()
        .then((value) => value);
      let roomsize_area = await room_divs[i]
        .findElement(By.xpath("//div[@class='thumb-cards_price']/span"))
        .getText()
        .then((value) => value);
      let roomsize_size = await room_divs[i]
        .findElement(
          By.xpath(
            "//div[@class='guests-and-roomsize_item guests-and-roomsize_size']"
          )
        )
        .getText()
        .then((value) => value.replace("\nsquare feet", ""));
      let price = await room_divs[i]
        .findElement(By.className("thumb-cards_price"))
        .getText()
        .then((value) => value);
      // let other_info = room_divs[i].findElements(By.TAG_NAME, "li")
      console.log({
        room_name,
        roomsize_area,
        roomsize_bed,
        roomsize_guests,
        roomsize_size,
        price,
      });
    } catch (error) {
      // if i<1 then i=0 implying that there is an error on the webpage we're scraping. Likely to be that the element is not found: NoSuchElement Error
      i < 1 ? console.error(error) : "";
    }
  }

  // await drivers.quit();
};

const cancun = async () => {
  let options = new chrome.Options();
  let drivers = await new Builder().forBrowser(Browser.CHROME).build();
  //   .setChromeOptions(options.headless())
  let date = new Date();
  let todays_date = setDate(date, "gracebay");
  date.setDate(date.getDate() + 1);
  let tomorrow = setDate(date, "gracebay");

  await drivers.manage().window().maximize();

  let website_url = `https://be.synxis.com/?_ga-ft=1bNOi3.0.0.0.0.3ZPUE9-5h0-4io-BlJ-Akmnwggi.0.1&_gl=1*1bmc59b*_ga*MjA5OTcxNjkxOC4xNzAwNjI0MzA5*_ga_FDTY66CS39*MTcwMDYyODk2Mi4yLjEuMTcwMDYyOTI0Ny42MC4wLjA.&adult=1&arrive=${todays_date}&chain=24447&child=0&config=leading1&currency=USD&depart=${tomorrow}&hotel=6905&level=hotel&locale=en-US&roomcategory=JR%2C1BR%2C2BR%2C3BR%2C4BR%2C5BR&rooms=1&src=30&theme=leading1`;

  console.log({
    todays_date,
    tomorrow,
  });

  drivers.manage().setTimeouts({ implicit: 6000 });

  await drivers.get(website_url);
  let hotelName = await drivers
    .findElement(By.id("heroTitle"))
    .getText()
    .then((value) => value);

  console.log(hotelName);
  try {
    let check_avail = await drivers
      .findElement(
        By.xpath(
          "//div[@class='message_text']//h2[contains(@class, 'app_heading2 message_heading')]//span"
        )
      )
      .getText()
      .then((value) => value);

    console.log({ check_avail });
  } catch (error) {
    console.error("Element Exists: if not, kindly log out the error");
  }

  let button = await drivers.findElement(
    By.xpath(
      "//div[@class='select_container select_hasValue']//button[@class='select_hiddenInput']"
    )
  );
  await button.click();

  let lis = await drivers.findElement(
    By.xpath("//ul[@class='select_dropdown']//li")
  );
  await lis.click();

  drivers.manage().setTimeouts({ implicit: 6000 });

  let itr = await drivers.findElements(
    By.xpath(
      "//div[@class='app_row']//div[contains(@class, 'app_col-md-12 app_col-lg-12')]"
    )
  );
  for (i = 0; i < itr.length; i++) {
    try {
      let room_divs = await drivers.findElements(
        By.xpath(
          "//div[@class='app_row']//div[contains(@class, 'app_col-md-12 app_col-lg-12')]"
        )
      );
      let room_name = await room_divs[i]
        .findElement(By.css("h2"))
        .getText()
        .then((value) => value);
      let roomsize_guests = await room_divs[i]
        .findElement(
          By.xpath(
            "//div[@class='guests-and-roomsize_item guests-and-roomsize_guests']/span"
          )
        )
        .getText()
        .then((value) => value);
      let roomsize_bed = await room_divs[i]
        .findElement(
          By.xpath(
            "//div[@class='guests-and-roomsize_item guests-and-roomsize_bed']/span"
          )
        )
        .getText()
        .then((value) => value);
      let roomsize_area = await room_divs[i]
        .findElement(By.xpath("//div[@class='thumb-cards_price']/span"))
        .getText()
        .then((value) => value);
      let roomsize_size = await room_divs[i]
        .findElement(
          By.xpath(
            "//div[@class='guests-and-roomsize_item guests-and-roomsize_size']"
          )
        )
        .getText()
        .then((value) => value.replace("\nsquare feet", ""));
      let price = await room_divs[i]
        .findElement(By.className("thumb-cards_price"))
        .getText()
        .then((value) => value);
      // let other_info = room_divs[i].findElements(By.TAG_NAME, "li")
      let beachEscapes = room_divs[i].findElement(By.xpath(""));
      console.log({
        room_name,
        roomsize_area,
        roomsize_bed,
        roomsize_guests,
        roomsize_size,
        price,
        rates: {
          beachEscapes,
          standard,
        },
      });
    } catch (error) {
      // if i<1 then i=0 implying that there is an error on the webpage we're scraping. Likely to be that the element is not found: NoSuchElement Error
      i < 1 ? console.error(error) : "";
    }
  }

  await drivers.quit();
};

wymara_resort();

module.exports = {
  sugar_beach,
  grace_bay_club,
  nizuc,
  wymara_resort,
  cancun,
};