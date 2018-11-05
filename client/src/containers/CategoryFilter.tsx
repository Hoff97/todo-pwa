import { Dispatch, Action } from "redux";
import { CategoryInfo, catInfoFromTodos } from "src/util/category";
import { clearFilter } from "src/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from 'react';
import { connect } from 'react-redux';
import { StoreState } from 'src/types';

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
        <div>
            {filterCategory &&
                <div style={{'backgroundColor': categoryColor(filterCategory)}} className="categoryLabel">
                    #{filterCategory}
                    <a onClick={e => dispatch(clearFilter())}> <FontAwesomeIcon icon="times"/></a>
                </div>
            }
        </div>
        );
}


let Category = connect((state: StoreState) => {
    return {
        filterCategory: state.ui.filterCategory,
        categoryInfo: catInfoFromTodos(state.todos.state)
    }
},
(dispatch: Dispatch<Action<any>>) => {
    return {
        dispatch
    }
})(CategoryF);

export default Category;