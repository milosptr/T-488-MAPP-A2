## Assignment II - The Contactor

### Rubric

#### 1. A user should see a list of all his saved contacts

**Learning outcome:** A user should see a list of all his saved contacts.

Assessed on:

- Alphabetically ordered in ascending order (0.5 points)
- Displaying name (0.5 points)
- Displaying a thumbnail (0.5 points)

| Points | Conditions met   |
| ------ | ---------------- |
| 1.5    | 3/3 criteria met |
| 1.0    | 2/3 criteria met |
| 0.5    | 1/3 criteria met |
| 0      | No marks         |

---

#### 2. Searching - Contact list filters dynamically based on search filter

**Learning outcome:** Contact list filters dynamically based on search filter.

Assessed on:

- Contact list filters dynamically based on search input (1 point)

| Points | Description                           |
| ------ | ------------------------------------- |
| 1.0    | Full marks, fully functional          |
| 0.5    | Half marks, not functioning correctly |
| 0      | No marks, little to no functionality  |

---

#### 3. Searching - Search should be a case insensitive substring search

**Learning outcome:** Search should be a case insensitive substring search.

Assessed on:

- Search matches case insensitive substrings in contact names (0.5 points)

| Points | Description                           |
| ------ | ------------------------------------- |
| 0.5    | Full marks, fully functional          |
| 0.25   | Half marks, not functioning correctly |
| 0      | No marks, little to no functionality  |

---

#### 4. Adding a user - A form should be displayed which can be used to add a new contact

**Learning outcome:** A user should be able to create a new contact.

Assessed on:

- A form is displayed to add a new contact (1 point)

| Points | Description                           |
| ------ | ------------------------------------- |
| 1.0    | Full marks, fully functional          |
| 0.5    | Half marks, not functioning correctly |
| 0      | No marks, little to no functionality  |

---

#### 5. The user should be stored within the file system using FileSystem component provided by Expo

**Learning outcome:** New contacts are persisted to the file system.

Assessed on:

- When the form is submitted, the user is stored in the file system
- The user is stored in the specified JSON format, with all properties populated

| Points | Conditions met     |
| ------ | ------------------ |
| 1.0    | 2/2 conditions met |
| 0.5    | 1/2 conditions met |
| 0      | No marks           |

---

#### 6. A user should see detailed information on a selected contact

**Learning outcome:** A user should see detailed information on a selected contact.

Assessed on:

- Displaying name (0.33 points)
- Displaying image (0.33 points)
- Displaying phone number (0.33 points)

| Points | Conditions met       |
| ------ | -------------------- |
| 1.0    | 3/3 fields displayed |
| 0.66   | 2/3 fields displayed |
| 0.33   | 1/3 fields displayed |
| 0      | No marks             |

---

#### 7. Modifying a user - All properties should be editable

**Learning outcome:** All properties of a contact can be edited.

Assessed on:

- Image is editable
- Name is editable
- Phone number is editable

| Points | Conditions met          |
| ------ | ----------------------- |
| 1.0    | 3/3 properties editable |
| 0.66   | 2/3 properties editable |
| 0.33   | 1/3 properties editable |
| 0      | No marks                |

---

#### 8. Modifying a user - JSON file is recreated with the new information

**Learning outcome:** Updated contact is persisted correctly.

Assessed on:

- JSON file is recreated with latest information, same structure as initial format

| Points | Description                           |
| ------ | ------------------------------------- |
| 1.0    | Full marks, fully functional          |
| 0.5    | Half marks, not functioning correctly |
| 0      | No marks, little to no functionality  |

---

#### 9. Extras - Import contacts from OS

**Learning outcome:** A user can import contacts from the operating system.

Assessed on:

- A user can import contacts from the OS into the app

| Points | Description                           |
| ------ | ------------------------------------- |
| 1.0    | Full marks, fully functional          |
| 0.5    | Half marks, not functioning correctly |
| 0      | No marks, little to no functionality  |

---

#### 10. Extras - Add image with camera or photo import

**Learning outcome:** A user can add an image from camera or gallery.

Assessed on:

- A user can add an image using the camera
- A user can add an image by importing from the gallery

| Points | Description                           |
| ------ | ------------------------------------- |
| 1.0    | Full marks, fully functional          |
| 0.5    | Half marks, not functioning correctly |
| 0      | No marks, little to no functionality  |

---

#### 11. Extras - A user can make a call to a contact from the application

**Learning outcome:** A user can make a phone call to a contact.

Assessed on:

- A user can initiate a phone call to some contact within the phonebook

| Points | Description                           |
| ------ | ------------------------------------- |
| 1.0    | Full marks, fully functional          |
| 0.5    | Half marks, not functioning correctly |
| 0      | No marks, little to no functionality  |

---

**Total points:** 11

---

# Original assignment file

# Contactor

Code red! I repeat code red! The native Contacts application in iOS and Android has been wiped out clean and nobody can find the source code. The IMDC (International Mobile Device Committee) has contacted us in order to release a new software which can replace the native Contact application (at least for the time being). This is where you come in, to take over this operation and deliver a new Contact application. As always, failure is not an option!

## Structure

If the code does not follow the principles laid down here below, each group can receive up to -2 in deduction for their assignment. Here are the rules of structure:

- TypeScript is required
- Code should be broken up into components which follow the Single Responsibility Principle
- Common logic should reside in a separate module and imported into components which make use of this logic
- The folder structure should be in accordance to the course lectures
- Consistency in code, meaning all group members should follow the same set of rules, e.g. 4 spaces as indent, Egyptian style curly braces, etc… hint: eslint can help

## Assignment description

Here below is an enlisting of all the functionality this application should implement:

- (50%) Contacts screen
    - (15%) A user should see a list of all his saved contacts
    - (5%) Alphabetically ordered (ascending order)
    - (10%) Only displaying name and thumbnail photo
    - (15%) A user should be able to search for contacts by their name
    - (10%) Contact list filters dynamically based on search filter
    - (5%) Search should be a case insensitive substring search

- (20%) A user should be able to create a new contact (see Model section below)
    - (10%) A form should be displayed which can be used to add a new contact
    - (10%) The user should be stored within the file system using FileSystem component provided by Expo. The user should be stored in the following format:
        - `<name-of-contact>-<uuid>.json` - The uuid portion of the filename should be a generated uuid to distinct two persons who share the same name. The file content should contain a JSON object which contains the properties associated with each user: `name`, `phoneNumber` and `photo`

- (30%) Contact detail screen
    - (10%) A user should see detailed information on a selected contact
        - (3.33%) Name
        - (3.33%) Image
        - (3.33%) Phone number

    - (20%) A user should be able to modify the information on each contact
        - (10%) All properties should be editable
        - (10%) As a result of modifying the contact the JSON file associated with this contact should be recreated with the new information

- (30%) Extras
    - (10%) Import contacts from OS
        - [https://docs.expo.io/versions/latest/sdk/contacts/](https://docs.expo.io/versions/latest/sdk/contacts/)

    - (10%) Add image with camera or photo import
        - [https://docs.expo.dev/versions/latest/sdk/imagepicker](https://docs.expo.dev/versions/latest/sdk/imagepicker)

    - (10%) A user can make a call to a contact from the application

## Model

Here all the models are enlisted and each property they should contain:

**Contact**

- Name
- Phone number
- Image

## Penalty

There will be a penalty of -2 in deduction if the `node_modules/` is included in the submission. Please don’t forget this, as this is a painful yet crucial deduction.

## Submission

A single compressed file (`*.zip`, `*.rar`) should be submitted. Don’t forget to delete `node_modules/` from the folder before compressing it and eventually submitting.
