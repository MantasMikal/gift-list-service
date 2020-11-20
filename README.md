# Gift List Service

It is customary for events such as weddings for those tying the knot to make a list of the gifts they would like. Guests can then pick from the list to make sure they are buying something that is useful. All the gift list data and selections should be stored in a database.

Heroku URL: https://mikalaum-sem1.herokuapp.com/
Github URL: https://github.com/MantasMikal/mikalaum-sem1/ 

## Agreed code exceptions

- Disable unused variables eslint rule in javascript files that run in the browser
- Use button instead of checkbox to pledge gifts (Checkbox is used to indicate gift status)

## Testing

The system includes the data for 5 valid events and each event already has two items pledged from from user accounts

1. `user1`
2. `user2`
3. `user3`

All accounts have the password `p455w0rd`:

Gmail Accounts

1. `user: mikalaum.user1@gmail.com`
   
   `pass: mikalaumUser1`

2. `user: mikalaum.user2@gmail.com`
   
   `pass: mikalaumUser2`

3. `user: mikalaum.user3@gmail.com`
   
   `pass: mikalaumUser3`


---


## Completed functionality: 

## Stage 1

The core functionality consists of three screens:

### Part 1

The home screen should be viewable whether the `user` is logged in or not and should display a summary of all the events that lists have been created for, including:

1. A brief title
2. A thumbnail image
3. The date of the event formatted as DD/MM/YYYY

### Part 2

If a `user` is logged in there should be a button or link on the homepage to allow them to create a new event. The following information should be requested:

1. The event title
2. A full-size image to represent the event uploaded from their computer.
3. The date when the event is taking place selected from a date picker.
4. A detailed, multi-line, formatted description of the event.
5. Space to add up to five items to be added to the list, each to include the name, price and link to the online details.

### Part 3

Users should be able to click on one of the photos or event titles to be taken to an **event details** screen which includes:

1. The details of the event (see previous point)
2. A list of the items wanted with each item showing its status (the name of the person who has pledged the item).
3. If the item has not yet been pledged, the `user` can click on a checkbox which assigns their name to pledge the item.


## Stage 2

The intermediate tasks require you to make changes to the functionality:

1. The list of requests should not be limited to five items, users should be able to add as few or as many as they want.
2. When a user pledges an item the system should send an email to the person who set up the list to let them know of the pledge. The email should contain:
    1. A description of the pledge and its value
    2. A link to the event screen
3. When the original user receives the pledge (for example goods were delivered) they should be able to set the status of this on the system which should send out a personalised thank you email to the donor.