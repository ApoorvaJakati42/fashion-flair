import React , {useState , useContext} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton  from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab'
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import { SwipeableDrawer } from '@material-ui/core';
import { Badge } from '@material-ui/core';
import { List } from '@material-ui/core';
import { ListItem } from '@material-ui/core';
import { ListItemText } from '@material-ui/core';
import { Link , navigate } from 'gatsby';

import search from '../../images/search.svg';
import cartIcon from '../../images/cart.svg';
import account from '../../images/account-header.svg';
import menu from '../../images/menu.svg';

import { CartContext } from '../../contexts';

const useStyles = makeStyles( theme => ({
      coloredIndicator : {
        backgroundColor : "#fff"
      },
      logo : {
        fontSize : "6rem",
        [theme.breakpoints.down("md")] : {
          fontSize : "4rem"
        },
        [theme.breakpoints.down("sm")] : {
          fontSize : "2.25rem"
        }
      },
      logoText : {
        color : theme.palette.common.offBlack
      },
      logoContainer : {
        [theme.breakpoints.down("md")] : {
          marginRight : "auto"
        }
      },
      tab : {
        ...theme.typography.body1,
        fontWeight : 500
      },
      tabs : {
        marginLeft : 'auto' ,
        marginRight : "auto"
      },
      icon : {
        height : "3rem" ,
        width : "3rem",
        [theme.breakpoints.down("xs")] : {
          height : "2rem" ,
          width : "2rem",
        }
      },
      drawer : {
        backgroundColor : theme.palette.primary.main
      },
      listItemText : {
        color : "#fff"
      },
      badge : {
        fontSize : "1rem" ,
        color : "#fff" ,
        backgroundColor : theme.palette.secondary.main,
        [theme.breakpoints.down("xs")] : {
          fontSize : "0.75rem" ,
          height : "1.1rem" ,
          width : "1.1rem",
          minWidth : 0
        }
      }
      
      //This is used tp override the styles when we inspect element in the browser
      // "@global" : {
      //   '.MuiTypography-h1' : {
      //     fontSize : "30rem"
      //   }
      // }
}))

export default function Header({ categories }) {
  
  const classes = useStyles();
  const matchesMD = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const [drawerOpen , setDrawerOpen] = useState(false);

  const {cart} = useContext(CartContext)

  const activeIndex = () => {

    const pathname = typeof window !== "undefined" ? 
    window.location.pathname.split("/")[1] : null  
   
        const found = routes.indexOf(
          routes.filter(
            (
              {node: {name,link}}
            )=>
            (link || `/${name.toLowerCase()}`) === `/${pathname}`
          )[0]
        )



         return found === -1 ? false : found
       
  }

  const routes = [...categories , {node : { name : 'Contact Us' , strapiId : 'contact' , link : "/contact"}}]

  //console.log("Routes set for header tab : " + JSON.stringify(routes.map(route => console.log("Routes link " + route.node.link))))

  const tabs = (
      <Tabs value={activeIndex()} classes={{indicator : classes.coloredIndicator , root : classes.tabs}}>
      {routes.map(route => (
        <Tab 
        component={Link} to={route.node.link || `/${route.node.name.toLowerCase()}`}
        classes={{root : classes.tab}} 
        label={route.node.name} 
        key={route.node.strapiId}/>
      ))}
    </Tabs>
  );

  const drawer = (
    <SwipeableDrawer 
    open={drawerOpen} 
    onOpen={() => setDrawerOpen(true)} 
    onClose={() => setDrawerOpen(false)}
    disableBackdropTransition={!iOS} 
    disableDiscovery={iOS}
    classes={{paper : classes.drawer}}>
      <List disablePadding>
        {[...routes , {node : { name : 'Account' , strapiId : 'account' , link : "/account"}}].map((route , i) => (
          <ListItem component={Link} to={route.node.link || `/${route.node.name.toLowerCase()}`}
           selected={activeIndex() === i}
           divider button key={route.node.strapiId}>
            <ListItemText classes={{primary : classes.listItemText}} primary={route.node.name}/>
          </ListItem>
        ))}
      </List>
    </SwipeableDrawer> 
  );

  const actions = [
    {icon : search , alt: "search" , visible : true , onClick : () => console.log("search")} ,
     {icon : cartIcon , alt: "cart" ,  visible : true , link : "/cart"} ,
      {icon : account , alt: "account" ,  visible : !matchesMD , link : "/account"},
      {icon : menu , alt: "menu" ,  visible : matchesMD , onClick : () => setDrawerOpen(true)}
    ]

  return (
    <AppBar color="transparent" elevation={0} position="static">
      <Toolbar disableGutters>
        <Button component={Link} to="/" classes={{root : classes.logoContainer}}>
          <Typography variant="h1" classes={{root : classes.logo}}><span className={classes.logoText}>STYLE</span> SENSED</Typography>
        </Button>

        {matchesMD ? drawer : tabs}

        {actions.map(action => {
            const image = <img className={classes.icon} alt={action.alt} src={action.icon} />

            if (action.visible) {
              return  (
                <IconButton key={action.alt} 
                component={action.onClick ? undefined : Link} 
                to={action.onClick ? undefined : action.link} 
                onClick={action.onClick}>
                  {action.alt === "cart" ? (
                    <Badge overlap="circle" badgeContent={cart.length} classes={{ badge : classes.badge}}>
                       {image}
                    </Badge>
                  ) : (
                     image
                  )}
                  
                </IconButton>)
            }
            
        })}
       
      </Toolbar>
    </AppBar>
  );
}
