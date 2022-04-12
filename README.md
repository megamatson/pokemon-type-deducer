# What is this?

This project is designed to be used to deduce the type of a Pokemon from how effective your attacks are against the target.

# Where can I use it?

You can find the project [here](https://megamatson.github.io/pokemon-type-deducer/)!

If you want to run the app on your machine (e.g. if you want to make changes to the app, or if you just want an offline version of the app), then do the following:
* install node.js
* clone this repo
* run `npm install` from the cloned repo.

After that, you can start the app by running `npm start` from within the cloned repo. More information can be found in the "Development" section.

# How do I use it?
Here is an example:

* I am fighting a Beedrill and I use Tackle against it.
> The move hits and is normally effective.
>> In the app, I will select the "1" button in the "Normal" row, since a Normal-type move was normally effective against the target Pokemon.

* I then use Peck against Beedrill.
> The move is super effective.
>> In the app, I will select the "+" button in the "Flying" row.

* I use Leaf Blade against Beedrill.
> The move is not very effective.
>> In the app, I will select the "-" button in the "Grass" row.

* I use Toxic against Beedrill.
> The move has no effect.
>> In the app, normally I would select "0" in the "Poison" row in the Types section, however, since Toxic has an entry in the Effects section, I will set it to "0" there instead.\
At this point, several radio buttons will be filled out despite you not providing data for them, e.g. Fighting is not very effective. These are deduced from the data you entered. The app would have found one common type, Poison. This means that Beedrill has the Poison type (assuming this app's types and effects matches that of your game). Finally, you can see that Beedrill is one of three possible types: {Grass, Fighting, Bug}, Poison. You can continue using moves that don't have any data to further narrow down the type, or just use a move that you know the effectiveness of.

# Troubleshooting

## One of the radio buttons is selected even though I did not select it!

That is a deduced effectiveness. Given all the data you provided, that effectiveness should also be valid.

## I cannot select a certain effectiveness!

That's because that effectiveness combination is not possible. For instance, if a Normal-type move has no effect, a Fighting-type move will also have no effect, since the target Pokemon is a Ghost type. If your observations do not match the app's deductions, here are some possible explanations:
* Your game uses different effectivenesses than the app (e.g. an older game, or a rebalance ROM hack/fan game)
* You made a mistake somewhere, for instance, you started entering data when there was already something filled out, or you misclicked a bubble.

# Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.\
In addition, the project will be deployed onto the github site.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
