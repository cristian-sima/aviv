// @flow

import { MongoClient } from "mongodb";
import fs from "fs";

import { dbPort } from "../config-server";

import { listOfRawInstitutions } from "../load/institutions";
import { listOfRawUsers } from "../load/users";
import { prenume } from "../load/prenume";

import { generateTemporaryPassword } from "./auth/util";

const url = `mongodb://localhost:${dbPort}/aviz`;

const four = 4;

const writeToFile = (data) => {
  fs.writeFile("./output.json", JSON.stringify(data, null, four), (err) => {
    if (err) {
      return console.log(err);
    }

    console.log("The data was saved !");
    console.log("All was ok!");
    return console.log("Use Control + C to stop the script");
  });
};

const findInstitutionByName = (nameToFind, list) => {
  for (const institution of list) {
    if (nameToFind === institution.name) {
      return institution;
    }
  }

  throw new Error(`No institution with the name ${nameToFind}`);
};

const findInstitutionByID = (idToFind, list) => {
  for (const institution of list) {
    if (idToFind === institution._id) {
      return institution;
    }
  }

  throw new Error(`No institution with the _id ${idToFind}`);
};

const formatBeforeWrite = (users, institutions) => {

  const groupBy = (list, keyGetter) => {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (collection) {
        collection.push(item);
      } else {
        map.set(key, [item]);
      }
    });
    return map;
  };

  const data = users.map((user) => {
    delete user._id;

    return user;
  });

  const finalGroups = [];

  const grouped = groupBy(data, (current) => current.institutionID);

  // iterate over map elements
  for (const [
    key,
    item,
  ] of grouped) {

    const institutionName = findInstitutionByID(key, institutions).name;

    finalGroups.push({
      institutionName,
      users: item,
    });

  }

  return writeToFile({
    users: finalGroups,
  });
};

const generateNumber = () => {
  const
    min = 1000,
    max = 9999;

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomNumber = () => (
  `021.${generateNumber()}.${generateNumber()}`
);

const getRandomElementFromArray = (list : any) => (
  list[Math.floor(Math.random() * list.length)]
);

const getRandomName = () => (
  `${getRandomElementFromArray(prenume)} ${getRandomElementFromArray(prenume)}`
);

const getEmail = (name) => {
  const parts = name.split(" ");

  return `${parts[0].toLowerCase()}_${parts[1].toLowerCase()}@gov.ro`;
};

MongoClient.connect(url, (errConnectDatabase, db) => {
  if (errConnectDatabase) {
    console.log(errConnectDatabase);
  }

  const institutions = db.collection("institutions");

  institutions.insert(listOfRawInstitutions, (errInsertInstitutions, { ops : listOfInstitutions }) => {
    if (errInsertInstitutions) {
      console.log("errInsertInstitutions", errInsertInstitutions);
      return console.log("Can't insert institutions");
    }

    console.log("Institutions added!");

    const usersToInsert = [];

    for (const { username, institution } of listOfRawUsers) {
      const
        name = getRandomName(),
        user = {
          username,
          institutionID     : findInstitutionByName(institution, listOfInstitutions)._id,
          name,
          temporaryPassword : generateTemporaryPassword(),
          requireChange     : true,
          phone             : getRandomNumber(),
          email             : getEmail(name),
        };

      usersToInsert.push(user);
    }

    return db.collection("users").insert(usersToInsert, (errInsertUsers, { ops : users }) => {
      if (errInsertUsers) {
        console.log("errInsertUsers", errInsertUsers);
        return console.log("Can't insert users");
      }

      console.log("Users added!");

      return formatBeforeWrite(users, listOfInstitutions);
    });
  });
});
