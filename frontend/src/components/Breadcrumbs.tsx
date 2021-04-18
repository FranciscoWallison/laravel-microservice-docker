import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Link, { LinkProps } from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import { Route } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { Location } from 'history'
import routes from '../routes';
import RouteParse from 'route-parser';
import { Container, Box } from '@material-ui/core';

const breadcrumbNameMap: { [key: string]: string } = {};
routes.forEach(route => breadcrumbNameMap[route.path as string] = route.label)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    linkRouter: {
      color: "#4db5ab",
      "&:focus, &:active": {
        color: "#4db5ab"
      },
      "&:haver": {
        color: "#055a52"
      }
    }
  }),
);

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

const LinkRouter = (props: LinkRouterProps) => <Link {...props} component={RouterLink as any} />;

export default function Breadcrumbs() {
  const classes = useStyles();
  
  function makeBreadcrumb(location: Location){
    const pathnames = location.pathname.split('/').filter((x) => x);
    pathnames.unshift('/');
    return (
      <MuiBreadcrumbs aria-label="breadcrumb">
        {
          pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `${pathnames.slice(0, index + 1)
                                    .join('/').replace('//', '/')}`;
            const rout = Object.keys(breadcrumbNameMap)
                                .find(path => new RouteParse(path)
                                .match(to));

            if(rout === undefined) return false;

            return last ? (
              <Typography color="textPrimary" key={to}>
                {breadcrumbNameMap[to]}
              </Typography>
            ) : (
              <LinkRouter color="inherit" to={to} key={to} className={classes.linkRouter}>
                {breadcrumbNameMap[to]}
              </LinkRouter>
            );
          })
        }
      </MuiBreadcrumbs>
    );
  }

  return (
    <Container>
      <Box paddingTop={2} paddingBottom={1}>
        <Route>
          {
            ({location} : {location: Location}) => makeBreadcrumb(location)
          }
        </Route>
      </Box>      
    </Container>

  );
}
