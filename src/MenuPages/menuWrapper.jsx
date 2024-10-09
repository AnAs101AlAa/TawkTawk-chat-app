import propTypes from 'prop-types';

export default function MenuWrapper({ children }) {
    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full z-10">
                {children}
            </div>
        </div>
    )
};

MenuWrapper.propTypes = {
    children: propTypes.node.isRequired
};