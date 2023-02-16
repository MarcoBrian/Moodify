# Song Recommendation Through Facial Emotion Detection
Emotion Recognition With Spotify API 



# Backend and Python Environment
We are using Python version 3.7.7

tensorboard==2.4.1

Flask==1.1.1

opencv-python==4.5.1.48

numpy==1.19.5

The full environment of the backend project could be found in ai_environment.yml , using Anaconda you can import the environment using the .yml file. 

Run the app.py python file to start running Flask server. The server will be running on port 5000. http://localhost:5000

For the application to work successfully, please run the backend server before running the frontend application. 

# Front end 

1. Install dependencies 
`$ npm install`

2. Start front end 
`$ npm start `

3. This will start the frontend server on http://localhost:3000 , and now you can view the application on the browser. 

# Application Demo

####   1. Landing Page 
![login](https://github.com/MarcoBrian/aiapplication_webdev/blob/master/images/login.JPG)


#### 2. OAuth authorization with Spotify, Log in to Spotify Premium with User Credentials
Once user successfully login they will be redirected back to home page of the application

![spotify](https://github.com/MarcoBrian/aiapplication_webdev/blob/master/images/spotify.JPG)

#### 3. Search functionality 

User can search for songs using the search bar and the song results would be shown below
![search](https://github.com/MarcoBrian/aiapplication_webdev/blob/master/images/search.JPG)


#### 4. Songs Emotion recommendation 
#### Neutral 
Neutral emotion will return back the top songs of the particular user
![neutral](https://github.com/MarcoBrian/aiapplication_webdev/blob/master/images/neutral.JPG)

#### Happy 
Return playlists with happy upbeat songs
![happy](https://github.com/MarcoBrian/aiapplication_webdev/blob/master/images/happy.JPG)

#### Sad 
Return playlists with sad songs
![sad](https://github.com/MarcoBrian/aiapplication_webdev/blob/master/images/sad.JPG)

#### Surprise 
Return featured Spotify playlists (new songs / selected songs)
![surprise](https://github.com/MarcoBrian/aiapplication_webdev/blob/master/images/surprise.JPG)

#### Fear
Return calming songs (to reduce anxiety, fear)
![fear](https://github.com/MarcoBrian/aiapplication_webdev/blob/master/images/fear.JPG)




