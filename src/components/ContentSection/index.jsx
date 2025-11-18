const ContentSection = ({ title, children, className = "" }) => {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-md h-full flex flex-col">
            <h3 className="bg-blue-200 text-blue-700 px-6 py-4 text-lg font-bold tracking-wide">
                {title}
            </h3>
            <div className={`p-8 flex-1 ${className}`}>
                {children}
            </div>
        </div>
    );
};

export default ContentSection;
