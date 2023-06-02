import React , {useState} from 'react';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import background from '../../images/repeating-smallest.svg';
import { ButtonGroup } from '@material-ui/core';
import { Button } from '@material-ui/core';
import ListIcon from '../../images/list';
import GridIcon from '../../images/grid';
import clsx from 'clsx';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';


const useStyles = makeStyles(theme => ({
        description : {
            color : "#fff"
        },
        descriptionContainer : {
            backgroundColor : theme.palette.primary.main,
            height : "15rem" ,
            width : "60%" ,
            borderRadius : 25 ,
            padding : "1rem" ,
            [theme.breakpoints.down("md")] : {
                width : "100%"
            },
            [theme.breakpoints.down("sm")] : {
                borderRadius : 0
            }
        },
        mainContainer : {
            padding : "3rem" ,
            backgroundImage : `url(${background})` ,
            backgroundPosition : "center" ,
            backgroundRepeat : "repeat" ,
            position : "relative" ,//Our absolute position element will be relative to this element
            [theme.breakpoints.down("sm")] : {
                padding : "3rem 0"
            }
        },
        button : {
            border : `2px solid ${theme.palette.primary.main}`,
            borderRadius : 25,
            borderRightColor : `${theme.palette.primary.main} !important`,
            backgroundColor : "#fff",
            padding : "0.5rem  1.5rem",
            "&:hover" : {
                backgroundColor : "#fff"
            }
        },
        selected : {
            backgroundColor : theme.palette.primary.main,
            "&:hover" : {
            backgroundColor : theme.palette.primary.light
            }
        },
        buttonGroup : {
            position : "absolute" , //absolute position ignores other elements present and if we add padding it will be ignored
            right :  0 ,
            bottom : 0 ,
            marginRight : "3rem" ,
            marginBottom : "3rem",
            [theme.breakpoints.down("md")] : {
                position : "relative" ,
                display : "flex" ,
                alignSelf : "flex-end",
                marginRight : 0 ,
               marginBottom : 0,
               marginTop : "3rem"
            },
            [theme.breakpoints.down("sm")] : {
                marginRight : "1.5rem"
            }
        }
}))

export default function DescriptionContainer ({name , description , layout , setLayout }) {
    const classes = useStyles();
    const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))

    const changeLayout = (option) => {
        setLayout(option)
    }
    

    return (
        <Grid item container 
        justify="center" 
        direction={matchesMD ? "column" : "row"} 
        alignItems={matchesMD ? "center" : undefined}
        classes={{root : classes.mainContainer}}>
            <Grid item classes={{root : classes.descriptionContainer}}>
                <Typography align="center" variant="h4" >
                    {name}
                </Typography>
                <Typography align="center" variant="body1" classes={{root : classes.description}}>
                    {description}
                </Typography>
            </Grid>
            <Grid item classes={{root : classes.buttonGroup}}>
                <ButtonGroup>
                    <Button onClick={() => changeLayout("list")} classes={{outlined : clsx(classes.button , {
                        [classes.selected] : layout === "list"
                    })}}>
                        <ListIcon color={layout === "list" ? "#fff" : undefined} />
                    </Button>
                    <Button onClick={() => changeLayout("grid")} classes={{outlined : clsx(classes.button , {
                        [classes.selected]: layout === "grid"
                    })}}>
                        <GridIcon color={layout === "grid" ? "#fff" : undefined} />
                    </Button>
                </ButtonGroup>
            </Grid>
        </Grid>
    )
}