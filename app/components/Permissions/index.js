import React, { Fragment } from "react";
import { connect } from "react-redux";

function hasAllPermissions(requiredRoles, userPermissions) {
  const status = requiredRoles.some(elem => userPermissions.indexOf(elem) > -1);
  return status;


  // const status = requiredRoles.every(
  //   elem => userPermissions.indexOf(elem) > -1
  // );
  // return status;
}

function hasAtleastOnePermission(requiredRoles, userPermissions) {
  const status = requiredRoles.some(elem => userPermissions.indexOf(elem) > -1);
  return status;
}

function Permissions(props) {
  const perType = props.type;
  const userPermissions = props.roles;

  const permissions = props.permissions;

  const globalReturn = <Fragment>{props.children}</Fragment>;

  if (!perType) {
    return globalReturn;
  }


  // suger coated for all search related permissions
  if (perType === "search") {
    return globalReturn;
    // // console.log("condition::search");
    // let requiredRoles = [];
    // if (permissions["menu.criminal.search"]) {
    //   requiredRoles = requiredRoles.concat(permissions["menu.criminal.search"]);
    // }
    // if (permissions["menu.civil.search"]) {
    //   requiredRoles = requiredRoles.concat(permissions["menu.civil.search"]);
    // }
    // if (permissions["menu.latent.search"]) {
    //   requiredRoles = requiredRoles.concat(permissions["menu.latent.search"]);
    // }

    // if (hasAtleastOnePermission(requiredRoles, userPermissions)) {
    //   return globalReturn;
    // } else { return (<div></div>) }
  }

  // suger coated for all update related permissions
  else if (perType === "update") {
    return globalReturn;

    // let requiredRoles = [];
    // if (permissions["menu.latent.update"]) {
    //   requiredRoles = requiredRoles.concat(permissions["menu.latent.update"]);
    // }
    // if (permissions["menu.criminal.update"]) {
    //   requiredRoles = requiredRoles.concat(permissions["menu.criminal.update"]);
    // }
    // if (permissions["menu.settings.update"]) {
    //   requiredRoles = requiredRoles.concat(permissions["menu.settings.update"]);
    // }

    // if (hasAtleastOnePermission(requiredRoles, userPermissions)) {
    //   return globalReturn;
    // } else { return (<div></div>) }
  }

  // suger coated for all delete related permissions
  else if (perType === "delete") {
    let requiredRoles = [];

    if (permissions["menu.job.delete"]) {
      requiredRoles = requiredRoles.concat(permissions["menu.job.delete"]);
    }

    if (hasAtleastOnePermission(requiredRoles, userPermissions)) {
      return globalReturn;
    } else { return (<div></div>) }

    // if (permissions["menu.biosearch.criminal.delete"]) {
    //   requiredRoles = requiredRoles.concat(
    //     permissions["menu.biosearch.criminal.delete"]
    //   );
    // }
    // if (permissions["menu.job.delete"]) {
    //   requiredRoles = requiredRoles.concat(permissions["menu.job.delete"]);
    // }
    // if (permissions["menu.customersearch.criminal.delete"]) {
    //   requiredRoles = requiredRoles.concat(
    //     permissions["menu.customersearch.criminal.delete"]
    //   );
    // }
    // if (permissions["menu.latent.deleter"]) {
    //   requiredRoles = requiredRoles.concat(permissions["menu.latent.deleter"]);
    // }

    // if (hasAtleastOnePermission(requiredRoles, userPermissions)) {
    //   return globalReturn;
    // } else { return (<div></div>) }

  }

  // suger coated for all subsequent action related permissions
  else if (perType === "subsequentAction") {

    return globalReturn;

    // let requiredRoles = [];
    // if (permissions["menu.customersearch.criminal.enroll"]) {
    //   requiredRoles = requiredRoles.concat(
    //     permissions["menu.customersearch.criminal.enroll"]
    //   );
    // }
    // if (permissions["menu.customersearch.criminal.delete"]) {
    //   requiredRoles = requiredRoles.concat(
    //     permissions["menu.customersearch.criminal.delete"]
    //   );
    // }
    // if (permissions["menu.criminal.enroll"]) {
    //   requiredRoles = requiredRoles.concat(permissions["menu.criminal.enroll"]);
    // }
    // if (permissions["menu.latent.enroll"]) {
    //   requiredRoles = requiredRoles.concat(permissions["menu.latent.enroll"]);
    // }
    // if (permissions["menu.latent.update"]) {
    //   requiredRoles = requiredRoles.concat(permissions["menu.latent.update"]);
    // }

    // if (hasAtleastOnePermission(requiredRoles, userPermissions)) {
    //   return globalReturn;
    // } else { return (<div></div>) }
  }

  // checks the default required permissions and existing permissions
  else if (permissions && permissions[perType]) {
    // console.log("condition::default  permissions, perType, permissions[perType]", permissions, perType, permissions[perType] );
    // console.log("userPermissions",userPermissions);
    let requiredRoles = permissions[perType];
    // console.log("requiredRoles", requiredRoles);
    if (hasAllPermissions(requiredRoles, userPermissions)) {
      return globalReturn;
    } else { return (<div></div>) }
  }

  else {
    return (<div></div>);
  }

  return (<div></div>);
}

const mapState = state => ({
  roles: state.auth.parsedRoles,
  permissions: state.auth.menuPerm
});

export default connect(
  mapState,
  null
)(Permissions);
