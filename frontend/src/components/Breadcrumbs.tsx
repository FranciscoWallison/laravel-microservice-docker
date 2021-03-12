import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Link, { LinkProps } from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import { Route } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { Location } from 'history'
import routes from '../routes';

const breadcrumbNameMap: { [key: string]: string } = {};
routes.forEach(route => breadcrumbNameMap[route.path as string] = route.label)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: 360,
    },
    lists: {
      backgroundColor: theme.palette.background.paper,
      marginTop: theme.spacing(1),
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
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
            const to = `/${pathnames.slice(0, index + 1).join('/').replace('//', '/')}`;

            return last ? (
              <Typography color="textPrimary" key={to}>
                {breadcrumbNameMap[to]}
              </Typography>
            ) : (
              <LinkRouter color="inherit" to={to} key={to}>
                {breadcrumbNameMap[to]}
              </LinkRouter>
            );
          })
        }
      </MuiBreadcrumbs>
    );
  }

  return (
    <div className={classes.root}>
      <Route>
        {
          ({location} : {location: Location}) => makeBreadcrumb(location)
        }
      </Route>
    </div>

  );
}