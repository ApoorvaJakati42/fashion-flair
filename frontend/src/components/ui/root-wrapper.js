import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme'
import { ApolloWrapper } from '../../apollo/ApolloWrapper';
import { UserWrapper } from '../../contexts';
import { FeedBackWrapper } from '../../contexts';
import { CartWrapper } from '../../contexts';

export default ({element}) => {
    return (
        <ThemeProvider theme={theme}>
            <ApolloWrapper>
                <UserWrapper>
                    <FeedBackWrapper>
                        <CartWrapper>
                            {element}
                        </CartWrapper>
                    </FeedBackWrapper>
               </UserWrapper>
            </ApolloWrapper>
        </ThemeProvider>
    )
}