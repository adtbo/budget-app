import { useState } from "react";
import { Button, Container, Stack } from "react-bootstrap";
import AddBudgetModal from "./components/AddBudgetModal copy/AddBudgetModal.component";
import AddExpenseModal from "./components/AddExpenseModal/AddExpenseModal.component";
import ViewExpenseModal from "./components/ViewExpensesModal/ViewExpensesModal.component";
import BudgetCard from "./components/BudgetCard/BudgetCard.component";
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "./context/budgetContext";

const _renderUncategorizedBudgetCard = (
  getBudgetExpenses,
  openAddExpenseModal,
  setViewExpenseModalBudgetId
) => {
  const amount = getBudgetExpenses(UNCATEGORIZED_BUDGET_ID).reduce(
    (total, expense) => total + expense.amount,
    0
  );
  if (amount === 0) return null;
  return (
    <BudgetCard
      amount={amount}
      name="Uncategorized"
      gray
      onAddExpenseClick={openAddExpenseModal}
      onViewExpenseClick={() =>
        setViewExpenseModalBudgetId(UNCATEGORIZED_BUDGET_ID)
      }
    />
  );
};

const _renderTotalBudgetCard = (expenses, budgets) => {
  const amount = expenses.reduce((total, expense) => total + expense.amount, 0);
  const max = budgets.reduce((total, budget) => total + budget.max, 0);

  if (max === 0) return null;
  return <BudgetCard amount={amount} name="Total" gray hideButtons max={max} />;
};

function App() {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [viewExpenseModalBudgetId, setViewExpenseModalBudgetId] = useState();
  const [addExpenseModalBudgetId, setAddExpenseModalId] = useState();
  const { budgets, expenses, getBudgetExpenses } = useBudgets();

  function openAddExpenseModal(budgetId) {
    setShowAddExpenseModal(true);
    setAddExpenseModalId(budgetId);
  }

  return (
    <>
      <Container className="my-4">
        <Stack direction="horizontal" gap="2" className="mb-4">
          <h1 className="me-auto">Budget</h1>
          <Button variant="primary" onClick={() => setShowAddBudgetModal(true)}>
            Add Budget
          </Button>
          <Button variant="outline-primary" onClick={openAddExpenseModal}>
            Add Expense
          </Button>
        </Stack>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(300px, 1fr))",
            gap: "1rem",
            alignItems: "flex-start",
          }}
        >
          {budgets.map((budget) => {
            const amount = getBudgetExpenses(budget.id).reduce(
              (total, expense) => total + expense.amount,
              0
            );
            return (
              <BudgetCard
                name={budget.name}
                key={budget.id}
                amount={amount}
                max={budget.max}
                onAddExpenseClick={() => openAddExpenseModal(budget.id)}
                onViewExpenseClick={() =>
                  setViewExpenseModalBudgetId(budget.id)
                }
              />
            );
          })}
          {_renderUncategorizedBudgetCard(
            getBudgetExpenses,
            openAddExpenseModal,
            setViewExpenseModalBudgetId
          )}
          {_renderTotalBudgetCard(expenses, budgets)}
        </div>
      </Container>
      <AddBudgetModal
        show={showAddBudgetModal}
        handleClose={() => setShowAddBudgetModal(false)}
      />
      <AddExpenseModal
        show={showAddExpenseModal}
        defaultBudgetId={addExpenseModalBudgetId}
        handleClose={() => setShowAddExpenseModal(false)}
      />
      <ViewExpenseModal
        budgetId={viewExpenseModalBudgetId}
        handleClose={() => setViewExpenseModalBudgetId()}
      />
    </>
  );
}

export default App;
