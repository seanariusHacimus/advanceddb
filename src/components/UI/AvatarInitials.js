import React from 'react';
import { StyledAvatarInitials } from '../../styles';
import groupImage from '../../assets/messaging/group.svg';

export default function AvatarInitials(props) {
  const { size, name = '' } = props;

  let style = {}
  const yellow = { color: '#fff', backgroundColor: '#FFC107' }
  const green = { color: '#fff', backgroundColor: '#4CAF50' }
  const blue = { color: '#fff', backgroundColor: '#2196F3' }
  const red = { color: '#fff', backgroundColor: '#E91E63' }
  const grey = { color: '#fff', backgroundColor: '#607D8B' }

  const firstLetter = name[0]?.toLowerCase()?.charCodeAt(0);

  if (firstLetter >= 117 && firstLetter <= 122) {
    // z-u
    style = red;
  } else if (firstLetter >= 112 && firstLetter <= 117) {
    // p-t
    style = green;
  } else if (firstLetter >= 107 && firstLetter <= 112) {
    // p-t
    style = blue;
  } else if (firstLetter >= 102 && firstLetter <= 107) {
    // f-p
    style = yellow;
  } else {
    style = grey;
  }

  if (name.split(',').length > 1) {
    return (
      <StyledAvatarInitials style={style} size={size}>
        {name.split(',').length}
      </StyledAvatarInitials>
    )
  }
  return (
    <StyledAvatarInitials style={style} size={size}>
      {name.split(' ').map(i => i.slice(0, 1)).join('')}
    </StyledAvatarInitials>
  )
}
