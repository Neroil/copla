import MyButton from '../ui-component/button'; // Adjust path as needed

function TestButton() {
    const handleClick = () => {
        console.log('Primary button clicked!');
    };

    return (
        <div className="p-8 space-y-4"> {/* Use Tailwind for layout */}
            <h1>My Awesome Page</h1>

            <MyButton onClick={handleClick}>
                Primary Action
            </MyButton>

            <MyButton variant="secondary" size="small">
                Secondary Action
            </MyButton>

            <MyButton variant="danger" disabled>
                Cannot Delete
            </MyButton>

            <MyButton className="mt-8 border-3 border-purple-500"> {/* Adding extra classes */}
                Custom Border Button
            </MyButton>
        </div>
    );
}

export default TestButton;
