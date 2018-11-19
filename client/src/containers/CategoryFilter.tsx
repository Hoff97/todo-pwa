import { Dispatch, Action } from "redux";
import { CategoryInfo, catInfoFromTodos } from "src/util/category";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from 'react';
import { connect } from 'react-redux';
import { StoreState } from 'src/types';
import { Link } from 'react-router-dom';

interface Props {
    dispatch: Dispatch<Action<any>>;
    filterCategory?: string;
    categoryInfo: CategoryInfo[];
}

function CategoryF({ filterCategory, categoryInfo, dispatch }: Props) {
    function categoryColor(name: string) {
        return categoryInfo.filter(x => x.name === name)[0].color;
    }
    return (
        <div style={{paddingTop: 50}}>
            {filterCategory &&
                <div style={{'backgroundColor': categoryColor(filterCategory)}} className="categoryLabel">
                    #{filterCategory}&nbsp;
                    <Link to="/" style={{ textDecoration: 'none', color: '#FFF' }}><FontAwesomeIcon icon="times"/></Link>
                </div>
            }
        </div>
        );
}


const Category = connect((state: StoreState) => {
  let params = new URLSearchParams(state.routing.search);
  const category = params.get('category')
    return {
        filterCategory: category,
        categoryInfo: catInfoFromTodos(state.todos)
    }
},
(dispatch: Dispatch<Action<any>>) => {
    return {
        dispatch
    }
})(CategoryF);

export default Category;