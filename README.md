# MyIonicReactMToNRelationApp
is an Ionic/React/Redux 

Essentially, the following concepts are demonstrated:

- Ionic/React
- Redux
- Docker
- PostgreSQL as a data source with Prisma
- Web service with Prisma and PostgreSQL
- m to n relations

The primary intention of this example was Redux. While there are a number of Redux examples and tutorials available online, and also several tutorials on YouTube (the best I found was by Dave Gray https://www.youtube.com/watch?v=NqzdVN2tyvQ&t=10796s), it becomes challenging when one wishes to tackle something more sophisticated, such as the implementation of a many-to-many relationship. For this reason, I created this example. It demonstrates the representation of courses to students and vice versa, and offers as convenient a handling as possible of their association, realised through <IonModal/> windows.
As in the other examples (MyIonicReactUserManagementWithRolesApp, MyIonicReactUserManagementApp, and MyAngularUserManagementApp), the appropriate database (PostgreSQL) and the backend are encapsulated within a Docker container/image (yes, I am aware that one should run only one component in a Docker container, but I wished to keep it as simple as possible with the focus primarily on the frontend and Redux). Should one have Docker installed on their system, by executing the following command, one can create the container and should have everything necessary to run the frontend example.

`docker run --name my-m-to-n-container -p 3000:3000 -p 5432:5432 -e POSTGRES_USER=m_to_n_user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=mydb -d uhwgmxorg/my-m-to-n-relation-app-postgresql-docker-image:0.0.0`

![img](https://github.com/uhwgmxorg/MyIonicReactMToNRelationApp.node/blob/master/Doc/97_1.png)
![img](https://github.com/uhwgmxorg/MyIonicReactMToNRelationApp.node/blob/master/Doc/97_2.png)
![img](https://github.com/uhwgmxorg/MyIonicReactMToNRelationApp.node/blob/master/Doc/97_3.png)

The web application can be started with: 

`npx vite`. 

The node modules must first be installed using: 

`npm install`.

You can get more Information on: https://uhwgmxorg.wordpress.com/