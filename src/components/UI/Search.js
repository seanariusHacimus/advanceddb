import React, { forwardRef, useState } from 'react';
import { ReactComponent as IconSearch } from '../../assets/header/search.svg';
import { Flex, Input } from '../../styles';
import {useLocale} from "../../utils/locale";

const SearchComponent = forwardRef((props, ref) => {
  const self = ref;
  const [t] = useLocale()
  const { query } = self.state;
  const { data, dataKey, placeholder } = props;
  const searchMemberHandler = (e) => {
    const { query } = self.state;
    self.setState({ loading: true }, () => {
      const selectedMembers = data.filter((item) => {
        if (dataKey.length > 1) {
          const key1 = item[dataKey[0]]?.toLowerCase().includes(query.toLowerCase());
          const key2 = item[dataKey[1]]?.toLowerCase().includes(query.toLowerCase());

          if (key1 || key2) {
            return item;
          }
        } else {
          const key1 = item[dataKey[0]].toLowerCase().includes(query.toLowerCase());
          if (key1) {
            return item;
          }
        }
        return
      });
      self.setState({ loading: false, selectedMembers, isSearchActive: true });
    });
  };

  return (
    <Flex id="inner-search" style={{ marginLeft: 'auto' }}>
      <div id="inner-search-wrapper">
        <Input
          type="search"
          value={query}
          id="search-title"
          autoComplete="off"
          ref={ref}
          style={{ maxWidth: 300, marginRight: 10 }}
          placeholder={placeholder || t('Search member')}
          onChange={(e) => self.setState({ query: e.target.value }, () => {
            console.log(ref);
            if (!ref.state.query.length) {
              return self.setState({ isSearchActive: false });
            }
          })}
          onKeyPress={(e) => {
            if (e.which === 13) searchMemberHandler();
          }}
        />
        {query && <span onClick={() => self.setState({ query: '', isSearchActive: false })}>x</span>}
      </div>
      <IconSearch
        style={{ minWidth: 19, minHeight: 19 }}
        onClick={searchMemberHandler}
        id="inner-search-btn"
      />
    </Flex>
  );
});

export default SearchComponent;

function Search(props) {
  const [t] = useLocale()
  const {
    placeholder, onSearch,
  } = props;
  const [query, setQuery] = useState('');
  return (
    <Flex id="inner-search" style={{ marginLeft: 'auto' }}>
      <div id="inner-search-wrapper">
        <Input
          type="search"
          placeholder={placeholder || t('Search member')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ maxWidth: 300, marginRight: 10 }}
          onKeyPress={(e) => {
            if (e.which === 13) onSearch(query);
          }}
        />
        {query && <span onClick={() => setQuery('')}>x</span>}
      </div>
      <IconSearch
        style={{ minWidth: 19, minHeight: 19, cursor: 'pointer' }}
        onClick={() => onSearch(query)}
        id="inner-search-btn"
      />
    </Flex>
  );
}

export { Search };
