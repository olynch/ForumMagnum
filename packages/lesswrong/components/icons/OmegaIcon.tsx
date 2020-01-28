import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';
import { createStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const styles = createStyles((theme) => ({
  root: {
    fontSize: 24,
    fontWeight: 600,
    fontFamily: ['Palatino',
      '"Palatino Linotype"',
      '"Palatino LT STD"',
      '"Book Antiqua"',
      'Georgia',
      'serif'].join(','),
    position:"relative",
    top:2,
    width: 24,
    textAlign:"center"
  }
}))

const OmegaIcon = ({classes, className}) => {
  return <span className={classNames(classes.root, className)}>Ω</span>

}

registerComponent('OmegaIcon', OmegaIcon, {styles});
