# Project Winemag
This project is a data dashboard built with the data from Winemag, a magazine for people who love wine. The data comprises wines from all over the world and has information on the price per bottle, a score from professional tasters, country of origin, grape variety and the date of production. 

Files with large amounts of data are not necessarily very valuable for people. Without help, humans are not able to quickly give meaning to such large amounts of data. In particular if you're not a data expert. Therefore, the list of data on the more than 25.000 wines from Winemag on itself is not very insightful. This project addresses this problem. It uses software to visualize the data. This will make it much easier for users to quickly see relations in the data and draw valuable conclusions. 

 

## Built with
1. HTML5
2. CSS3
3. JavaScript
4. MongoDB 
5. Python
6. Flask
7. DC
8. D3
9. Crossfilter
10. Queue 
11. MaterializeCSS

## Features
* Composite graph - The main graph of the dashboard is the bar chart that shows data on the average price and the average points of the wines per country. In combination with 'select year' and 'select grape variety' this graph can answer a question many users might have: which country produces the best wines for the best price? In order to be able to show this graph nicely with dc/d3 some creativity was needed, because otherwise the bars of the two graphs would be built on top of each other. The workaround was to add a renderlet method that has a listener (function) that does a CSS translate on the bars. 
* Switching between two datasets - The data is split into two datasets in order to improve the readability of the graphs (less countries) and to speed up the building up of the graphs. Users can easily switch between the two datsets with buttons in the navbar. 
* Clean data - the data is sanitized with the help of Excel. 

###### Features left to implement
* Top ten table - What would be really nice to add is a table that will show the top ten number of wines based on their individual scores in combination with their price. It would show the highest scores sorted by price from low to high (sorted by price, because it often happens that wines have the same score). 

## UX
This project visualizes this data. The main question that can be answered with the data is what the best wine is for the best price. Users of the dashboard can answer this question for wines per country, per grape variety and per year. Additionaly, users can also see which professional taster gave the score.

The project is built in Flask and uses MongoDB to store the data. In order to keep the graphs clear for the users, the data is split up into two collections in MongoDB: Europe and the Rest of the World. A JavaScript function is created to be able to switch between the two data sets.

## Getting started
When you want to work with this project yourself just git clone the githup repo to your personal machine: ```git clone git@github.com:steindevos/project-winemag.git```. 

#### Prerequisites
The backend is built in Flask which works with python. Therefore you have to have python installed on your machine. Type ```python --version``` to check whether you have python installed. 

#### Installation
1. Download the relevant libraries by pip installing the requirements.txt. file: ```pip3 install -r requirements.txt``` 
2. Upload the [Winemag data] in your own Mlab database. 
3. Connect the project to your Mlab database. Change the following lines of code in the dashboard.py file into your own settings: 

```
app.config["MONGO_DBNAME"] = "data_dashboard"
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
```
into 
```
app.config["MONGO_DBNAME"] = <your_db_name>
app.config["MONGO_URI"] = mongodb://<dbuser>:<dbpassword>@ds111012.mlab.com:11012/<your_db_name>
```
[Winemag data]: https://www.kaggle.com/christopheiv/winemagdata130k

#### Running tests


## Acknowledgements
The data comes from kaggle.com, an awesome website that offers free datasets. 

This data dashboard could have never been built without the help of all the great teachers from the Code Institute. 