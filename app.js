// Storage Controller
const StorageCtrl = (function(){

  // Public Methods
    return {
      storeItem: function(item) {
        let items;

        // Check if any items
        if(localStorage.getItem('items') === null) {
          items = [];

          // Push new item
          items.push(item);

          // Set ls
          localStorage.setItem('items', JSON.stringify(items));
        } else {
          items = JSON.parse(localStorage.getItem('items'));

          // Push the new item
          items.push(item);

          // Re set ls
          localStorage.setItem('items', JSON.stringify(items));
        }
      },
      getItemsFromStorage: function() {
        let items;
        if(localStorage.getItem('items') === null) {
          items = [];
        } else {
          items = JSON.parse(localStorage.getItem('items'));
        }
        return items;
      },
      updateItemStorage: function(updatedItem) {
        let items = JSON.parse(localStorage.getItem('items'));
        items.forEach(function(item, index) {
          if(updatedItem.id === item.id) {
            items.splice(index, 1, updatedItem);
          }
        });
        localStorage.setItem('items', JSON.stringify(items));
      },
      deleteItemFromStorage: function(id) {
        let items = JSON.parse(localStorage.getItem('items'));
        items.forEach(function(item, index) {
          if(id === item.id) {
            items.splice(index, 1);
          }
        });
        localStorage.setItem('items', JSON.stringify(items));
      },
      clearAllItemsFromStorage: function() {
        localStorage.removeItem('items');
      }
    }
})();

// Second way to store them
// storeItem: (item) => {
//   // Call StorageCtrl.getItemsFromStorage() to set items
//   const items = StorageCtrl.getItemsFromStorage();
//   // Add new item to local array
//   items.push(item);
//   // Stringify and set in ls 
//   localStorage.setItem('items', JSON.stringify(items)); 
// },
// getItemsFromStorage: () => {
//   // Get what's in ls 
//   const itemsLS = localStorage.getItem('items');
 
//   // return items or empty array 
//   return itemsLS === null ? [] : JSON.parse(itemsLS);
// }

// Item Controller
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }
  // Data Structure / State on react
  const data = {
    // items: [
    //   // {id: 0, name: 'Stake Dinner', calories: 1000},
    //   // {id: 1, name: 'Cookie', calories: 400},
    //   // {id: 2, name: 'Eggs', calories: 200}
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }
  // Public methdos
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      let ID;
      // Create id
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id) {
      let found = 0;
      // Loop throw item
      data.items.forEach(function(item){
        if(item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories) {
      // Calories to number
      calories = parseInt(calories);
      let found = 0;
      data.items.forEach(function(item){
        if(item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id) {
      // Get ids
      const ids = data.items.map(function(item){
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function() {
      data.items = [];
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getTotalCalories: function() {
      let total = 0;
      // Loop through items and get calories
      data.items.forEach(function(item){
        total += item.calories;
      });
      // Set total calories in data structure
      data.totalCalories = total;

      return data.totalCalories;
    },
    logData: function() {
      return data;
    }
  }

})();



// UI Controller
const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }
  // Public methods
  return {
    populateItemList: function(items) {
      let html = '';
      items.forEach(function(item) {
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>
        `;
      });
      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name:document.querySelector(UISelectors.itemNameInput).value,
        calories:document.querySelector(UISelectors.itemCaloriesInput).value
      }
    }, 
    addListItem: function(item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add id
      li.id = `item-${item.id}`;
      // Add html
      li.innerHTML = `
        <strong>${item.name}: </strong> 
        <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;
      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems); // it returns node list
      // Converting nodelist into arr
      listItems = Array.from(listItems);
      listItems.forEach(function(listItem){
        const itemId = listItem.getAttribute('id');
        if(itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `
          <strong>${item.name}: </strong> 
          <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        `;
        }
      });
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    clearAllItemsList: function() {
        let listItems = document.querySelectorAll(UISelectors.listItems);
        // Turn node list to array
        listItems = Array.from(listItems);
        listItems.forEach(function(item) {
          item.remove();
        });
    },
    getSelectors: function() {
      return UISelectors;
    }
  }
})();



// App Controller
const AppCtrl = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // Load Event listeners function expression
  const loadEventListeners = function() {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Edit icon clickevent
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Back btn event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    // Cler btn event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

    // Disable submit on enter
    document.addEventListener('keypres', function(e) {
      if(e.keyCode === 13 || e.which ===13){ // 13 is enter code
        e.preventDefault();
        return false;
      }
    });
  }
  // Add item submit
  const itemAddSubmit = function(e) {
    // Get from input from UICtrl
    const input = UICtrl.getItemInput();

    // Check for name and calories input
    if(input.name !== '' && input.calories !== '') {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI
      UICtrl.addListItem(newItem);

      // Get  total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);
      
      // Store in local storage
      StorageCtrl.storeItem(newItem);

      // Clear fields
      UICtrl.clearInput();
    };

    e.preventDefault();
  }
  //Update item submit
  const itemEditClick = function(e) {
    if(e.target.classList.contains('edit-item')){
      // Get the list item id
      const listId = e.target.parentNode.parentNode.id;

      // Break into an array
      const listIdArr = listId.split('-');

      // Get the actual id
      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  }
  // Update item submit
  const itemUpdateSubmit = function(e) {
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI 
    UICtrl.updateListItem(updatedItem);

     // Update  total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Update total calories to the UI
    UICtrl.showTotalCalories(totalCalories);

    // Update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  // Delete item submit
  const itemDeleteSubmit = function(e) {
    // Get id current item'
    currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Update  total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Update total calories to the UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    // Delete item from the local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    e.preventDefault();
  }

  // Clear ALL items event
  const clearAllItemsClick = function() {
    // Delete All items from data structure
    ItemCtrl.clearAllItems();

    // Delete from UI
    UICtrl.clearAllItemsList();

    // Clear All from local storage
    StorageCtrl.clearAllItemsFromStorage();

    // Update  total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Update total calories to the UI
    UICtrl.showTotalCalories(totalCalories);

    // Hide UL
    UICtrl.hideList();
  }

  // Public methods
  return {
    init: function() {
      // Set initial state
      UICtrl.clearEditState();
      // Fetch items from data structure
      const items = ItemCtrl.getItems();
      
      // Check if any items
      if(items.length === 0) {
        UICtrl.hideList();
      } else {
      // Populate list with items
      UICtrl.populateItemList(items);
      }

      // Get  total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
AppCtrl.init();